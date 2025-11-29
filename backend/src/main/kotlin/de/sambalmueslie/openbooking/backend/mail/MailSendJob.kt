package de.sambalmueslie.openbooking.backend.mail


import de.sambalmueslie.openbooking.backend.mail.api.MailJobContent
import de.sambalmueslie.openbooking.backend.mail.db.MailJobHistoryEntryData
import de.sambalmueslie.openbooking.backend.mail.db.MailJobHistoryRepository
import de.sambalmueslie.openbooking.backend.mail.external.MailClient
import de.sambalmueslie.openbooking.common.TimeProvider
import org.slf4j.Logger
import org.slf4j.LoggerFactory

internal class MailSendJob(
    val jobId: Long,
    private val jobContent: MailJobContent,
    private val jobHistoryRepository: MailJobHistoryRepository,
    private val timeProvider: TimeProvider,
    private var retryCounter: Int = 0
) {
    companion object {
        private val logger: Logger = LoggerFactory.getLogger(MailSendJob::class.java)
    }

    init {
        addHistoryEntry("Mail enqueued for sending")
    }

    fun getRetryCounter() = retryCounter

    fun process(client: MailClient): Boolean {
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
        jobHistoryRepository.save(MailJobHistoryEntryData(0, message, timeProvider.now(), jobId))
    }
}
