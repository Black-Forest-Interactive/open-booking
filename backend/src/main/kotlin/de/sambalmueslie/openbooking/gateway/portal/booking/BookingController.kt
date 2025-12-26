package de.sambalmueslie.openbooking.gateway.portal.booking

import de.sambalmueslie.openbooking.frontend.user.api.CreateBookingRequest
import io.micronaut.http.annotation.*
import io.micronaut.security.annotation.Secured
import io.micronaut.security.rules.SecurityRule
import io.swagger.v3.oas.annotations.tags.Tag

@Controller("/api/portal/booking")
@Tag(name = "Booking API")
@Secured(SecurityRule.IS_ANONYMOUS)
class BookingController(private val service: BookingGateway) {

    @Post()
    fun create(@Body request: CreateBookingRequest) = service.create(request)

    @Get("/request/{requestId}/received/message")
    fun getRequestReceivedMessage(requestId: Long, @QueryValue(defaultValue = "en") lang: String) =
        service.getRequestReceivedMessage(requestId, lang)


    @Post("confirm/email/{key}")
    fun confirmEmail(key: String) = service.confirmEmail(key)
}