package de.sambalmueslie.openbooking.gateway.admin.group

import de.sambalmueslie.openbooking.core.visitor.api.VisitorChangeRequest
import io.micronaut.data.model.Pageable
import io.micronaut.http.annotation.*
import io.micronaut.security.authentication.Authentication
import io.swagger.v3.oas.annotations.tags.Tag


@Controller("/api/admin/group")
@Tag(name = "Admin Group API")
class GroupController(private val gateway: GroupGateway) {
    @Get("/{id}")
    fun get(auth: Authentication, id: Long) = gateway.get(auth, id)

    @Get()
    fun getAll(auth: Authentication, pageable: Pageable) = gateway.getAll(auth, pageable)

    @Post()
    fun create(auth: Authentication, @Body request: VisitorChangeRequest) = gateway.create(auth, request)

    @Put("/{id}")
    fun update(auth: Authentication, id: Long, @Body request: VisitorChangeRequest) = gateway.update(auth, id, request)

    @Delete("/{id}")
    fun delete(auth: Authentication, id: Long) = gateway.delete(auth, id)

    @Put("/{id}/confirm")
    fun confirm(auth: Authentication, id: Long) = gateway.confirm(auth, id)
}