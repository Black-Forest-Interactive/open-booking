package de.sambalmueslie.openbooking.core.response


import de.sambalmueslie.openbooking.core.response.api.ResponseAPI
import de.sambalmueslie.openbooking.core.response.api.ResponseAPI.Companion.PERMISSION_READ
import de.sambalmueslie.openbooking.core.response.api.ResponseAPI.Companion.PERMISSION_WRITE
import de.sambalmueslie.openbooking.core.response.api.ResponseChangeRequest
import de.sambalmueslie.openbooking.core.response.api.ResponseType
import de.sambalmueslie.openbooking.common.checkPermission
import io.micronaut.data.model.Pageable
import io.micronaut.http.annotation.*
import io.micronaut.security.authentication.Authentication
import io.swagger.v3.oas.annotations.tags.Tag

@Controller("/api/backend/response")
@Tag(name = "Response API")
@Deprecated("move that to gateway")
class ResponseController(private val service: ResponseService) : ResponseAPI {

    @Get()
    override fun getAll(auth: Authentication, pageable: Pageable) = auth.checkPermission(PERMISSION_READ) { service.getAll(pageable) }

    @Get("/{id}")
    override fun get(auth: Authentication, @PathVariable id: Long) = auth.checkPermission(PERMISSION_READ) { service.get(id) }

    @Post()
    override fun create(auth: Authentication, @Body request: ResponseChangeRequest) =
        auth.checkPermission(PERMISSION_WRITE) { service.create(request) }

    @Put("/{id}")
    override fun update(auth: Authentication, @PathVariable id: Long, @Body request: ResponseChangeRequest) =
        auth.checkPermission(PERMISSION_WRITE) { service.update(id, request) }

    @Delete("/{id}")
    override fun delete(auth: Authentication, @PathVariable id: Long) =
        auth.checkPermission(PERMISSION_WRITE) { service.delete(id) }

    @Get("/find/{lang}/{type}")
    override fun find(auth: Authentication, @PathVariable lang: String, @PathVariable type: ResponseType) =
        auth.checkPermission(PERMISSION_READ) { service.find(lang, type) }

}
