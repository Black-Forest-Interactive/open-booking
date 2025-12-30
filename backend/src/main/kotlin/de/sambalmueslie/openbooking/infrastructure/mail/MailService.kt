package de.sambalmueslie.openbooking.infrastructure.mail


import de.sambalmueslie.openbooking.common.TimeProvider
import de.sambalmueslie.openbooking.common.findByIdOrNull
import de.sambalmueslie.openbooking.core.mail.api.*
import de.sambalmueslie.openbooking.core.mail.db.*
import io.micronaut.data.model.Page
import io.micronaut.data.model.Pageable
import io.micronaut.scheduling.annotation.Scheduled
import jakarta.inject.Singleton
import org.slf4j.LoggerFactory
import kotlin.system.measureTimeMillis

@Singleton
class MailService(
    private val jobRepository: de.sambalmueslie.openbooking.infrastructure.mail.db.MailJobRepository,
    private val jobContentRepository: de.sambalmueslie.openbooking.infrastructure.mail.db.MailJobContentRepository,
    private val jobHistoryRepository: de.sambalmueslie.openbooking.infrastructure.mail.db.MailJobHistoryRepository,
    private val client: de.sambalmueslie.openbooking.infrastructure.mail.external.MailClient,
    private val timeProvider: TimeProvider,
) {

    companion object {
        private val logger = LoggerFactory.getLogger(_root_ide_package_.de.sambalmueslie.openbooking.infrastructure.mail.MailService::class.java)
        private const val MAX_RETRIES = 2
        private const val MAX_QUEUE_SIZE = 1000
    }

    private val newJobs = mutableListOf<de.sambalmueslie.openbooking.infrastructure.mail.MailSendJob>()


    @Synchronized
    fun send(
        mail: de.sambalmueslie.openbooking.infrastructure.mail.api.Mail,
        from: de.sambalmueslie.openbooking.infrastructure.mail.api.MailParticipant,
        to: List<de.sambalmueslie.openbooking.infrastructure.mail.api.MailParticipant>,
        bcc: List<de.sambalmueslie.openbooking.infrastructure.mail.api.MailParticipant> = emptyList()
    ) {
        val title = "${mail.subject} -> ${to.joinToString { it.address }}"
        val jobData = jobRepository.save(_root_ide_package_.de.sambalmueslie.openbooking.infrastructure.mail.db.MailJobData.Companion.create(title, timeProvider.now()))
        val jobContent =
            jobContentRepository.save(_root_ide_package_.de.sambalmueslie.openbooking.infrastructure.mail.db.MailJobContentData.Companion.create(mail, from, to, bcc, jobData.id)).convert()
        val job = _root_ide_package_.de.sambalmueslie.openbooking.infrastructure.mail.MailSendJob(jobData.id, jobContent, jobHistoryRepository, timeProvider)
        newJobs.add(job)
    }

    @Synchronized
    private fun getNewJobs(): List<de.sambalmueslie.openbooking.infrastructure.mail.MailSendJob> {
        val jobs = newJobs.toList()
        newJobs.clear()
        return jobs
    }

    @Scheduled(cron = "0/10 * * * * ?")
    fun processNewJobs() {
        val duration = measureTimeMillis {
            val jobs = getNewJobs()
            if (jobs.isEmpty()) return
            jobs.forEach { process(it) }
        }
        _root_ide_package_.de.sambalmueslie.openbooking.infrastructure.mail.MailService.Companion.logger.info("Process new jobs finished within $duration ms.")
    }

    private fun process(job: de.sambalmueslie.openbooking.infrastructure.mail.MailSendJob) {
        try {
            val result = job.process(client)
            val data = jobRepository.findByIdOrNull(job.jobId) ?: return
            if (result) {
                jobRepository.update(data.updateStatus(_root_ide_package_.de.sambalmueslie.openbooking.infrastructure.mail.api.MailJobStatus.FINISHED, timeProvider.now()))
            } else {
                jobRepository.update(data.updateStatus(_root_ide_package_.de.sambalmueslie.openbooking.infrastructure.mail.api.MailJobStatus.FAILED, timeProvider.now()))
                if (job.getRetryCounter() <= _root_ide_package_.de.sambalmueslie.openbooking.infrastructure.mail.MailService.Companion.MAX_RETRIES) {
                    retry(job)
                }
            }
        } catch (e: Exception) {
            _root_ide_package_.de.sambalmueslie.openbooking.infrastructure.mail.MailService.Companion.logger.error("Error while processing job ${job.jobId}", e)
            val data = jobRepository.findByIdOrNull(job.jobId) ?: return
            jobRepository.update(data.updateStatus(_root_ide_package_.de.sambalmueslie.openbooking.infrastructure.mail.api.MailJobStatus.FAILED, timeProvider.now()))
        }
    }

    private val failedJobs = mutableListOf<de.sambalmueslie.openbooking.infrastructure.mail.MailSendJob>()

    @Synchronized
    private fun retry(job: de.sambalmueslie.openbooking.infrastructure.mail.MailSendJob) {
        val data = jobRepository.findByIdOrNull(job.jobId) ?: return
        if (failedJobs.size >= _root_ide_package_.de.sambalmueslie.openbooking.infrastructure.mail.MailService.Companion.MAX_QUEUE_SIZE) {
            jobHistoryRepository.save(
                _root_ide_package_.de.sambalmueslie.openbooking.infrastructure.mail.db.MailJobHistoryEntryData(
                    0,
                    "Dropped retry due to queue limit of ${_root_ide_package_.de.sambalmueslie.openbooking.infrastructure.mail.MailService.Companion.MAX_QUEUE_SIZE}reached",
                    timeProvider.now(),
                    job.jobId
                )
            )
            _root_ide_package_.de.sambalmueslie.openbooking.infrastructure.mail.MailService.Companion.logger.error("Drop retry job ${job.jobId}")
            jobRepository.update(data.updateStatus(_root_ide_package_.de.sambalmueslie.openbooking.infrastructure.mail.api.MailJobStatus.FAILED, timeProvider.now()))
            return
        }

        jobRepository.update(data.updateStatus(_root_ide_package_.de.sambalmueslie.openbooking.infrastructure.mail.api.MailJobStatus.RETRY, timeProvider.now()))
        failedJobs.add(job)
    }


    @Synchronized
    private fun getFailedJobs(): List<de.sambalmueslie.openbooking.infrastructure.mail.MailSendJob> {
        val jobs = failedJobs.toList()
        failedJobs.clear()
        return jobs
    }

    @Scheduled(cron = "0 0/15 * * * ?")
    fun processRetryJobs() {
        val duration = measureTimeMillis {
            val jobs = getFailedJobs()
            if (jobs.isEmpty()) return
            jobs.forEach { process(it) }
        }
        _root_ide_package_.de.sambalmueslie.openbooking.infrastructure.mail.MailService.Companion.logger.info("Process retry jobs finished within $duration ms.")
    }

    fun getJobs(pageable: Pageable): Page<de.sambalmueslie.openbooking.infrastructure.mail.api.MailJob> {
        return jobRepository.findAllOrderByUpdatedDesc(pageable).map { it.convert() }
    }

    fun getFailedJobs(pageable: Pageable): Page<de.sambalmueslie.openbooking.infrastructure.mail.api.MailJob> {
        return jobRepository.findAllByStatus(_root_ide_package_.de.sambalmueslie.openbooking.infrastructure.mail.api.MailJobStatus.FAILED, pageable).map { it.convert() }
    }

    fun getJobHistory(jobId: Long, pageable: Pageable): Page<de.sambalmueslie.openbooking.infrastructure.mail.api.MailJobHistoryEntry> {
        return jobHistoryRepository.findByJobIdOrderByTimestampDesc(jobId, pageable).map { it.convert() }
    }

    fun reRunJob(jobId: Long) {
        TODO("Not yet implemented")
    }


}
