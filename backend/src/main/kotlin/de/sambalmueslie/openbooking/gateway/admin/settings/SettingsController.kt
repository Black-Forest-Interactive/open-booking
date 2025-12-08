package de.sambalmueslie.openbooking.gateway.admin.settings

import de.sambalmueslie.openbooking.common.PatchRequest
import de.sambalmueslie.openbooking.core.settings.api.SettingChangeRequest
import io.micronaut.data.model.Pageable
import io.micronaut.http.annotation.*
import io.micronaut.security.authentication.Authentication
import io.swagger.v3.oas.annotations.tags.Tag


@Controller("/api/admin/settings")
@Tag(name = "Admin Settings API")
class SettingsController(private val gateway: SettingsGateway) {

    @Get("help")
    fun getHelpUrl(auth: Authentication) = gateway.getHelpUrl(auth)

    @Get("terms-and-conditions")
    fun getTermsAndConditionsUrl(auth: Authentication) = gateway.getTermsAndConditionsUrl(auth)

    @Get("title")
    fun getTitle(auth: Authentication) = gateway.getTitle(auth)

    @Get("/{id}")
    fun get(auth: Authentication, id: Long) = gateway.get(auth, id)

    @Get()
    fun getAll(auth: Authentication, pageable: Pageable) = gateway.getAll(auth, pageable)

    @Post()
    fun create(auth: Authentication, @Body request: SettingChangeRequest) = gateway.create(auth, request)

    @Put("/{id}")
    fun update(auth: Authentication, id: Long, @Body request: SettingChangeRequest) = gateway.update(auth, id, request)

    @Delete("/{id}")
    fun delete(auth: Authentication, id: Long) = gateway.delete(auth, id)

    @Patch("/{id}/value")
    fun setValue(auth: Authentication, id: Long, @Body value: PatchRequest<Any>) = gateway.setValue(auth, id, value)

    @Get("/by/key/{key}")
    fun findByKey(auth: Authentication, key: String) = gateway.findByKey(auth, key)
}