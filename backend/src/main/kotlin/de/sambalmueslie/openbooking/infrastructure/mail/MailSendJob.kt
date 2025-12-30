package de.sambalmueslie.openbooking.infrastructure.mail


import de.sambalmueslie.openbooking.common.TimeProvider
import org.slf4j.LoggerFactory

internal class MailSendJob(
    val jobId: Long,
    private val jobContent: de.sambalmueslie.openbooking.infrastructure.mail.api.MailJobContent,
    private val jobHistoryRepository: de.sambalmueslie.openbooking.infrastructure.mail.db.MailJobHistoryRepository,
    private val timeProvider: TimeProvider,
    private var retryCounter: Int = 0
) {
    companion object {
        private val logger = LoggerFactory.getLogger(_root_ide_package_.de.sambalmueslie.openbooking.infrastructure.mail.MailSendJob::class.java)
    }

    init {
        addHistoryEntry("Mail enqueued for sending")
    }

    fun getRetryCounter() = retryCounter

    fun process(client: de.sambalmueslie.openbooking.infrastructure.mail.external.MailClient): Boolean {
        if (retryCounter == 0) {
            addHistoryEntry("Mail sending started")
        } else {
            addHistoryEntry("Mail sending started for the $retryCounter time")
        }
        retryCounter++
        val result = client.send(jobContent.mail, jobContent.from, jobContent.to, jobContent.bcc)
        if (result) {
            addHistoryEntry("Mail sending finished")
        } else {
            addHistoryEntry("Mail sending failed")
        }
        return result
    }

    private fun addHistoryEntry(message: String) {
        jobHistoryRepository.save(_root_ide_package_.de.sambalmueslie.openbooking.infrastructure.mail.db.MailJobHistoryEntryData(0, message, timeProvider.now(), jobId))
    }
}
