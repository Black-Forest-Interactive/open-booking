package de.sambalmueslie.openbooking.infrastructure.audit.api

import de.sambalmueslie.openbooking.common.Entity
import java.time.LocalDateTime

data class AuditLogEntry(
    override val id: Long,
    val timestamp: LocalDateTime,
    val user: String,
    val level: AuditLogLevel,
    val message: String,
    val referenceId: String,
    val reference: String,
    val source: String,
) : Entity<Long>
