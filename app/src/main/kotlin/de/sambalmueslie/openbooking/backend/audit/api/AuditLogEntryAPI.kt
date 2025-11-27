package de.sambalmueslie.openbooking.backend.audit.api

import de.sambalmueslie.openbooking.common.AuthCrudAPI
import io.micronaut.data.model.Page
import io.micronaut.data.model.Pageable
import io.micronaut.security.authentication.Authentication

interface AuditLogEntryAPI : AuthCrudAPI<Long, AuditLogEntry, AuditLogEntryChangeRequest> {
    companion object {
        const val PERMISSION_READ = "openbooking.audit.log.read"
        const val PERMISSION_WRITE = "openbooking.audit.log.write"
    }

    fun findByReferenceId(auth: Authentication, referenceId: String, pageable: Pageable): Page<AuditLogEntry>

}
