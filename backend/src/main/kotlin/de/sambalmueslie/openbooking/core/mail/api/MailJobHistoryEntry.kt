package de.sambalmueslie.openbooking.core.mail.api

import de.sambalmueslie.openbooking.common.BusinessObject
import java.time.LocalDateTime

data class MailJobHistoryEntry(
    override val id: Long,
    val message: String,
    val timestamp: LocalDateTime,
) : BusinessObject<Long>
