package de.sambalmueslie.openbooking.core.staff


import de.sambalmueslie.openbooking.core.staff.api.StaffAPI
import de.sambalmueslie.openbooking.core.staff.api.StaffAPI.Companion.PERMISSION_READ
import de.sambalmueslie.openbooking.core.staff.api.StaffAPI.Companion.PERMISSION_WRITE
import de.sambalmueslie.openbooking.core.staff.api.StaffMemberChangeRequest
import de.sambalmueslie.openbooking.common.checkPermission
import io.micronaut.data.model.Pageable
import io.micronaut.http.annotation.*
import io.micronaut.security.authentication.Authentication
import io.swagger.v3.oas.annotations.tags.Tag


@Controller("/api/backend/staff")
@Tag(name = "Staff API")
@Deprecated("move that to gateway")
class StaffController(private val service: StaffService) : StaffAPI {

    @Get("/{id}")
    override fun get(auth: Authentication, @PathVariable id: Long) = auth.checkPermission(PERMISSION_READ) {
        service.get(id)
    }

    @Get()
    override fun getAll(auth: Authentication, pageable: Pageable) = auth.checkPermission(PERMISSION_READ) {
        service.getAll(pageable)
    }

    @Post()
    override fun create(auth: Authentication, @Body request: StaffMemberChangeRequest) = auth.checkPermission(PERMISSION_WRITE) {
        service.create(request)
    }

    @Put("/{id}")
    override fun update(auth: Authentication, @PathVariable id: Long, @Body request: StaffMemberChangeRequest) = auth.checkPermission(PERMISSION_WRITE) {
        service.update(id, request)
    }

    @Delete("/{id}")
    override fun delete(auth: Authentication, @PathVariable id: Long) = auth.checkPermission(PERMISSION_WRITE) {
        service.delete(id)
    }


}
