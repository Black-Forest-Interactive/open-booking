package de.sambalmueslie.openbooking.gateway.portal.settings

import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.micronaut.security.annotation.Secured
import io.micronaut.security.rules.SecurityRule
import io.swagger.v3.oas.annotations.tags.Tag

@Controller("/api/portal/settings")
@Tag(name = "Settings API")
@Secured(SecurityRule.IS_ANONYMOUS)
class SettingsController(private val service: SettingsGateway) {

    @Get("help")
    fun getHelpUrl() = service.getHelpUrl()

    @Get("terms-and-conditions")
    fun getTermsAndConditionsUrl() = service.getTermsAndConditionsUrl()

    @Get("title")
    fun getTitle() = service.getTitle()
}