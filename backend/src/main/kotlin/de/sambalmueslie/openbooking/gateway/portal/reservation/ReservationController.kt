package de.sambalmueslie.openbooking.gateway.portal.reservation

import io.micronaut.http.annotation.*
import io.micronaut.security.annotation.Secured
import io.micronaut.security.rules.SecurityRule
import io.micronaut.session.Session
import io.swagger.v3.oas.annotations.tags.Tag

@Controller("/api/portal/reservation")
@Tag(name = "Reservation API")
@Secured(SecurityRule.IS_ANONYMOUS)
class ReservationController(private val gateway: ReservationGateway) {
    @Post()
    fun create(session: Session, @Body request: CreateReservationRequest) = gateway.create(session, request)

    @Get("/{id}/received/message")
    fun getReservationReceivedMessage(id: Long, @QueryValue(defaultValue = "en") lang: String) = gateway.getReservationReceivedMessage(id, lang)


    @Get("/{id}/failed/message")
    fun getReservationFailedMessage(id: Long, @QueryValue(defaultValue = "en") lang: String) = gateway.getReservationFailedMessage(id, lang)


    @Post("confirm/email/{key}")
    fun confirmEmail(key: String) = gateway.confirmEmail(key)
}