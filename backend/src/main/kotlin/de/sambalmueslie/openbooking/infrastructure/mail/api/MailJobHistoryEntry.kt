package de.sambalmueslie.openbooking.infrastructure.mail.api

import de.sambalmueslie.openbooking.common.Entity
import java.time.LocalDateTime

data class MailJobHistoryEntry(
    override val id: Long,
    val message: String,
    val timestamp: LocalDateTime,
) : Entity<Long>
