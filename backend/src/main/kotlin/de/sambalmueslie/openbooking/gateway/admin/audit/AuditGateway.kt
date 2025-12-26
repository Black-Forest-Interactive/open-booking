package de.sambalmueslie.openbooking.gateway.admin.audit

import de.sambalmueslie.openbooking.common.checkPermission
import de.sambalmueslie.openbooking.core.audit.AuditLogEntryService
import de.sambalmueslie.openbooking.core.audit.api.AuditLogEntryChangeRequest
import de.sambalmueslie.openbooking.gateway.admin.PERMISSION_AUDIT_ADMIN
import io.micronaut.data.model.Pageable
import io.micronaut.security.authentication.Authentication
import jakarta.inject.Singleton

@Singleton
class AuditGateway(private val service: AuditLogEntryService) {

    fun getAll(auth: Authentication, pageable: Pageable) = auth.checkPermission(PERMISSION_AUDIT_ADMIN) { service.findAll(pageable) }
    fun get(auth: Authentication, id: Long) = auth.checkPermission(PERMISSION_AUDIT_ADMIN) { service.get(id) }
    fun findByReferenceId(auth: Authentication, referenceId: String, pageable: Pageable) = auth.checkPermission(PERMISSION_AUDIT_ADMIN) { service.findByReferenceId(referenceId, pageable) }

    fun create(auth: Authentication, request: AuditLogEntryChangeRequest) = auth.checkPermission(PERMISSION_AUDIT_ADMIN) { service.create(request) }
    fun update(auth: Authentication, id: Long, request: AuditLogEntryChangeRequest) = auth.checkPermission(PERMISSION_AUDIT_ADMIN) { service.update(id, request) }
    fun delete(auth: Authentication, id: Long) = auth.checkPermission(PERMISSION_AUDIT_ADMIN) { service.delete(id) }
}