package de.sambalmueslie.openbooking.core.mail.api

enum class MailJobStatus {
    QUEUED,
    RETRY,
    FINISHED,
    FAILED
}
