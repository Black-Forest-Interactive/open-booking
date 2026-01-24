package de.sambalmueslie.openbooking.infrastructure.audit.db

import com.fasterxml.jackson.databind.ObjectMapper
import de.sambalmueslie.openbooking.common.EntityData
import de.sambalmueslie.openbooking.infrastructure.audit.api.AuditLogEntry
import de.sambalmueslie.openbooking.infrastructure.audit.api.AuditLogEntryChangeRequest
import de.sambalmueslie.openbooking.infrastructure.audit.api.AuditLogLevel
import jakarta.persistence.*
import java.time.LocalDateTime

@Entity(name = "AuditLogEntry")
@Table(name = "audit_log_entry")
data class AuditLogEntryData(
    @Id @GeneratedValue var id: Long,
    @Column var timestamp: LocalDateTime,
    @Column var actor: String,
    @Column @Enumerated(EnumType.STRING) var level: AuditLogLevel,
    @Column var message: String,
    @Column var referenceId: String,
    @Column var reference: String,
    @Column var source: String,
    @Column var created: LocalDateTime,
    @Column var updated: LocalDateTime? = null,
) : EntityData<AuditLogEntry> {

    companion object {
        fun create(request: AuditLogEntryChangeRequest, mapper: ObjectMapper, timestamp: LocalDateTime): AuditLogEntryData {
            return AuditLogEntryData(
                0,
                request.timestamp,
                request.actor,
                request.level,
                request.message,
                request.referenceId,
                mapper.writeValueAsString(request.reference),
                request.source,
                timestamp, null
            )
        }
    }

    override fun convert(): AuditLogEntry {
        return AuditLogEntry(id, timestamp, actor, level, message, referenceId, reference, source, created, updated)
    }

    fun update(request: AuditLogEntryChangeRequest, mapper: ObjectMapper, timestamp: LocalDateTime): AuditLogEntryData {
        this.timestamp = request.timestamp
        actor = request.actor
        level = request.level
        message = request.message
        referenceId = request.referenceId
        reference = mapper.writeValueAsString(request.reference)
        source = request.source
        updated = timestamp
        return this
    }
}

