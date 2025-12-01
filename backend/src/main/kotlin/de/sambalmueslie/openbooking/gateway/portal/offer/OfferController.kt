package de.sambalmueslie.openbooking.gateway.portal.offer

import de.sambalmueslie.openbooking.frontend.user.api.OfferInfoSelectRequest
import io.micronaut.http.annotation.*
import io.micronaut.security.annotation.Secured
import io.micronaut.security.rules.SecurityRule
import io.swagger.v3.oas.annotations.tags.Tag

@Controller("/api/portal/offer")
@Tag(name = "Offer API")
@Secured(SecurityRule.IS_ANONYMOUS)
class OfferController(private val service: OfferGateway) {

    @Get("/{id}")
    fun get(@PathVariable id: Long) = service.get(id)

    @Post("/info")
    fun getInfo(@Body request: OfferInfoSelectRequest) = service.getInfo(request)

}