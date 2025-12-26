package de.sambalmueslie.openbooking.gateway.admin.audit

import de.sambalmueslie.openbooking.core.audit.api.AuditLogEntryChangeRequest
import io.micronaut.data.model.Pageable
import io.micronaut.http.annotation.*
import io.micronaut.security.authentication.Authentication
import io.swagger.v3.oas.annotations.tags.Tag

@Controller("/api/admin/audit")
@Tag(name = "Admin Audit API")
class AuditController(private val gateway: AuditGateway) {
    @Get()
    fun getAll(auth: Authentication, pageable: Pageable) = gateway.getAll(auth, pageable)

    @Get("/{id}")
    fun get(auth: Authentication, id: Long) = gateway.get(auth, id)

    @Get("/find/{referenceId}")
    fun findByReferenceId(auth: Authentication, referenceId: String, pageable: Pageable) = gateway.findByReferenceId(auth, referenceId, pageable)

    @Post()
    fun create(auth: Authentication, @Body request: AuditLogEntryChangeRequest) = gateway.create(auth, request)

    @Put("/{id}")
    fun update(auth: Authentication, id: Long, @Body request: AuditLogEntryChangeRequest) = gateway.update(auth, id, request)

    @Delete("/{id}")
    fun delete(auth: Authentication, id: Long) = gateway.delete(auth, id)
}