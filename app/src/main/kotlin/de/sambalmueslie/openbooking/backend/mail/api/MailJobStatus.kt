package de.sambalmueslie.openbooking.backend.mail.api

enum class MailJobStatus {
    QUEUED,
    RETRY,
    FINISHED,
    FAILED
}
