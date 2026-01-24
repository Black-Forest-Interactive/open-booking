package de.sambalmueslie.openbooking.infrastructure.mail.api

import java.time.LocalDateTime

data class MailJobHistoryEntry(
    val id: Long,
    val message: String,
    val timestamp: LocalDateTime,
)
