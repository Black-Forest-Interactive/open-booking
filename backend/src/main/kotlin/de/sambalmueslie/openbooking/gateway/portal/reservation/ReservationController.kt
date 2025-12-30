package de.sambalmueslie.openbooking.gateway.portal.reservation

import io.micronaut.http.annotation.*
import io.micronaut.security.annotation.Secured
import io.micronaut.security.rules.SecurityRule
import io.swagger.v3.oas.annotations.tags.Tag

@Controller("/api/portal/reservation")
@Tag(name = "Reservation API")
@Secured(SecurityRule.IS_ANONYMOUS)
class ReservationController(private val gateway: ReservationGateway) {
    @Post()
    fun create(@Body request: CreateReservationRequest) = gateway.create(request)

    @Get("/request/{requestId}/received/message")
    fun getRequestReceivedMessage(requestId: Long, @QueryValue(defaultValue = "en") lang: String) =
        gateway.getRequestReceivedMessage(requestId, lang)


    @Post("confirm/email/{key}")
    fun confirmEmail(key: String) = gateway.confirmEmail(key)
}