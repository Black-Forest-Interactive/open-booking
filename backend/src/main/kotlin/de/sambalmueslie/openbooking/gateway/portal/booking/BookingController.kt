package de.sambalmueslie.openbooking.gateway.portal.booking

import io.micronaut.http.annotation.*
import io.micronaut.security.annotation.Secured
import io.micronaut.security.rules.SecurityRule
import io.micronaut.session.Session
import io.swagger.v3.oas.annotations.tags.Tag

@Controller("/api/portal/booking")
@Tag(name = "Booking API")
@Secured(SecurityRule.IS_ANONYMOUS)
class BookingController(private val gateway: BookingGateway) {
    @Post()
    fun create(session: Session, @Body request: CreateBookingRequest, @QueryValue(defaultValue = "en") lang: String) = gateway.create(session, request, lang)

    @Post("confirm/email")
    fun confirmEmail(@QueryValue key: String) = gateway.confirmEmail(key)

    @Get()
    fun get(@QueryValue key: String) = gateway.get(key)
}