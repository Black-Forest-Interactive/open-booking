package de.sambalmueslie.openbooking.infrastructure.mail.api

enum class MailJobStatus {
    QUEUED,
    RETRY,
    FINISHED,
    FAILED
}
