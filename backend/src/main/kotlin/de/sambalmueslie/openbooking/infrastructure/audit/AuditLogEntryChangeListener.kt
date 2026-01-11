package de.sambalmueslie.openbooking.infrastructure.audit

import de.sambalmueslie.openbooking.common.BusinessObjectChangeListener
import de.sambalmueslie.openbooking.infrastructure.audit.api.AuditLogEntry

interface AuditLogEntryChangeListener : BusinessObjectChangeListener<Long, AuditLogEntry> {
}