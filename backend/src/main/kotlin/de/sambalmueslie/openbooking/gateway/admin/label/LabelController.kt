package de.sambalmueslie.openbooking.gateway.admin.label

import de.sambalmueslie.openbooking.core.label.api.LabelChangeRequest
import io.micronaut.data.model.Pageable
import io.micronaut.http.annotation.*
import io.micronaut.security.authentication.Authentication
import io.swagger.v3.oas.annotations.tags.Tag

@Controller("/api/admin/label")
@Tag(name = "Admin Label API")
class LabelController(private val gateway: LabelGateway) {
    @Get("/{id}")
    fun get(auth: Authentication, id: Long) = gateway.get(auth, id)

    @Get()
    fun getAll(auth: Authentication, pageable: Pageable) = gateway.getAll(auth, pageable)

    @Get("sorted")
    fun getAllSorted(auth: Authentication) = gateway.getAllSorted(auth)

    @Post()
    fun create(auth: Authentication, @Body request: LabelChangeRequest) = gateway.create(auth, request)

    @Put("/{id}")
    fun update(auth: Authentication, id: Long, @Body request: LabelChangeRequest) = gateway.update(auth, id, request)

    @Delete("/{id}")
    fun delete(auth: Authentication, id: Long) = gateway.delete(auth, id)
}