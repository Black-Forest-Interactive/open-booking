package de.sambalmueslie.openbooking.gateway.admin.response

import de.sambalmueslie.openbooking.core.response.api.ResponseChangeRequest
import de.sambalmueslie.openbooking.core.response.api.ResponseType
import io.micronaut.data.model.Pageable
import io.micronaut.http.annotation.*
import io.micronaut.security.authentication.Authentication
import io.swagger.v3.oas.annotations.tags.Tag


@Controller("/api/admin/response")
@Tag(name = "Admin Response API")
class ResponseController(private val gateway: ResponseGateway) {
    @Get()
    fun getAll(auth: Authentication, pageable: Pageable) = gateway.getAll(auth, pageable)

    @Get("/{id}")
    fun get(auth: Authentication, id: Long) = gateway.get(auth, id)

    @Post()
    fun create(auth: Authentication, @Body request: ResponseChangeRequest) = gateway.create(auth, request)

    @Put("/{id}")
    fun update(auth: Authentication, id: Long, @Body request: ResponseChangeRequest) = gateway.update(auth, id, request)

    @Delete("/{id}")
    fun delete(auth: Authentication, id: Long) = gateway.delete(auth, id)

    @Get("/find/{lang}/{type}")
    fun find(auth: Authentication, lang: String, type: ResponseType) = gateway.find(auth, lang, type)

}