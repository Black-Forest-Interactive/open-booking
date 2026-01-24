package de.sambalmueslie.openbooking.infrastructure.audit.api

import de.sambalmueslie.openbooking.common.EntityChangeRequest
import java.time.LocalDateTime

data class AuditLogEntryChangeRequest(
    val timestamp: LocalDateTime,
    val actor: String,
    val level: AuditLogLevel,
    val message: String,
    val referenceId: String,
    val reference: Any,
    val source: String,
) : EntityChangeRequest
