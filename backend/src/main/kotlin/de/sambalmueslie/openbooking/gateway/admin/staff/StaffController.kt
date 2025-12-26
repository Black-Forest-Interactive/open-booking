package de.sambalmueslie.openbooking.gateway.admin.staff

import de.sambalmueslie.openbooking.core.staff.api.StaffMemberChangeRequest
import io.micronaut.data.model.Pageable
import io.micronaut.http.annotation.*
import io.micronaut.security.authentication.Authentication
import io.swagger.v3.oas.annotations.tags.Tag


@Controller("/api/admin/staff")
@Tag(name = "Admin Staff API")
class StaffController(private val gateway: StaffGateway) {
    @Get("/{id}")
    fun get(auth: Authentication, id: Long) = gateway.get(auth, id)

    @Get()
    fun getAll(auth: Authentication, pageable: Pageable) = gateway.getAll(auth, pageable)

    @Post()
    fun create(auth: Authentication, @Body request: StaffMemberChangeRequest) = gateway.create(auth, request)

    @Put("/{id}")
    fun update(auth: Authentication, id: Long, @Body request: StaffMemberChangeRequest) = gateway.update(auth, id, request)

    @Delete("/{id}")
    fun delete(auth: Authentication, id: Long) = gateway.delete(auth, id)
}