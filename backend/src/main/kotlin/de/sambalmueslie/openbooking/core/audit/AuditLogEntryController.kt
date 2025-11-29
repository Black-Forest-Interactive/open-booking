package de.sambalmueslie.openbooking.core.audit

import de.sambalmueslie.openbooking.core.audit.api.AuditLogEntryAPI
import de.sambalmueslie.openbooking.core.audit.api.AuditLogEntryAPI.Companion.PERMISSION_READ
import de.sambalmueslie.openbooking.core.audit.api.AuditLogEntryAPI.Companion.PERMISSION_WRITE
import de.sambalmueslie.openbooking.core.audit.api.AuditLogEntryChangeRequest
import de.sambalmueslie.openbooking.common.checkPermission
import io.micronaut.data.model.Pageable
import io.micronaut.http.annotation.*
import io.micronaut.security.authentication.Authentication
import io.swagger.v3.oas.annotations.tags.Tag

@Controller("/api/backend/audit")
@Tag(name = "Audit Log Entry API")
@Deprecated("move that to gateway")
class AuditLogEntryController(private val service: AuditLogEntryService) : AuditLogEntryAPI {
    @Get()
    override fun getAll(auth: Authentication, pageable: Pageable) = auth.checkPermission(PERMISSION_READ) { service.findAll(pageable) }

    @Get("/{id}")
    override fun get(auth: Authentication, @PathVariable id: Long) = auth.checkPermission(PERMISSION_READ) { service.get(id) }

    @Get("/find/{referenceId}")
    override fun findByReferenceId(auth: Authentication, referenceId: String, pageable: Pageable) =
        auth.checkPermission(PERMISSION_READ) { service.findByReferenceId(referenceId, pageable) }

    @Post()
    override fun create(auth: Authentication, @Body request: AuditLogEntryChangeRequest) =
        auth.checkPermission(PERMISSION_WRITE) { service.create(request) }

    @Put("/{id}")
    override fun update(auth: Authentication, @PathVariable id: Long, @Body request: AuditLogEntryChangeRequest) =
        auth.checkPermission(PERMISSION_WRITE) { service.update(id, request) }

    @Delete("/{id}")
    override fun delete(auth: Authentication, @PathVariable id: Long) =
        auth.checkPermission(PERMISSION_WRITE) { service.delete(id) }

}
