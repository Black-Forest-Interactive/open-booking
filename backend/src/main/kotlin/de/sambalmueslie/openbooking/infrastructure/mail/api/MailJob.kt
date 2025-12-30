package de.sambalmueslie.openbooking.infrastructure.mail.api

import de.sambalmueslie.openbooking.common.BusinessObject
import java.time.LocalDateTime

data class MailJob(
    override val id: Long,
    val title: String,
    val status: de.sambalmueslie.openbooking.infrastructure.mail.api.MailJobStatus,
    val timestamp: LocalDateTime,
) : BusinessObject<Long>
