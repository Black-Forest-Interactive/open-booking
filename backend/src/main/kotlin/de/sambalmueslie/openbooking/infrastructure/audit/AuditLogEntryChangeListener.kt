package de.sambalmueslie.openbooking.infrastructure.audit

import de.sambalmueslie.openbooking.common.EntityChangeListener
import de.sambalmueslie.openbooking.infrastructure.audit.api.AuditLogEntry
import de.sambalmueslie.openbooking.infrastructure.audit.api.AuditLogEntryChangeRequest

interface AuditLogEntryChangeListener : EntityChangeListener<Long, AuditLogEntry, AuditLogEntryChangeRequest> {
}