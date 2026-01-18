package de.sambalmueslie.openbooking.infrastructure.mail.api

import de.sambalmueslie.openbooking.common.Entity
import java.time.LocalDateTime

data class MailJob(
    override val id: Long,
    val title: String,
    val status: MailJobStatus,
    val timestamp: LocalDateTime,
) : Entity<Long>
