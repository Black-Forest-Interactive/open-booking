package de.sambalmueslie.openbooking.backend.role


import de.sambalmueslie.openbooking.backend.role.api.RoleAPI
import de.sambalmueslie.openbooking.backend.role.api.RoleAPI.Companion.PERMISSION_READ
import de.sambalmueslie.openbooking.backend.role.api.RoleAPI.Companion.PERMISSION_WRITE
import de.sambalmueslie.openbooking.backend.role.api.TourRoleChangeRequest
import de.sambalmueslie.openbooking.common.checkPermission
import io.micronaut.data.model.Pageable
import io.micronaut.http.annotation.*
import io.micronaut.security.authentication.Authentication

@Controller("/api/backend/role")
class RoleController(private val service: RoleService) : RoleAPI {

    @Get("/{id}")
    override fun get(auth: Authentication, @PathVariable id: Long) = auth.checkPermission(PERMISSION_READ) {
        service.get(id)
    }

    @Get()
    override fun getAll(auth: Authentication, pageable: Pageable) = auth.checkPermission(PERMISSION_READ) {
        service.getAll(pageable)
    }

    @Post()
    override fun create(auth: Authentication, @Body request: TourRoleChangeRequest) = auth.checkPermission(PERMISSION_WRITE) {
        service.create(request)
    }

    @Put("/{id}")
    override fun update(auth: Authentication, @PathVariable id: Long, @Body request: TourRoleChangeRequest) = auth.checkPermission(PERMISSION_WRITE) {
        service.update(id, request)
    }

    @Delete("/{id}")
    override fun delete(auth: Authentication, @PathVariable id: Long) = auth.checkPermission(PERMISSION_WRITE) {
        service.delete(id)
    }

}
