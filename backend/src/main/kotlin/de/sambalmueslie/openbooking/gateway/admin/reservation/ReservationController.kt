package de.sambalmueslie.openbooking.gateway.admin.reservation

import de.sambalmueslie.openbooking.core.reservation.api.ReservationChangeRequest
import de.sambalmueslie.openbooking.core.reservation.api.ReservationConfirmationContent
import de.sambalmueslie.openbooking.core.search.reservation.api.ReservationSearchRequest
import io.micronaut.data.model.Pageable
import io.micronaut.http.annotation.*
import io.micronaut.security.authentication.Authentication
import io.swagger.v3.oas.annotations.tags.Tag

@Controller("/api/admin/reservation")
@Tag(name = "Admin Reservation API")
class ReservationController(private val gateway: ReservationGateway) {
    @Get()
    fun getAll(auth: Authentication, pageable: Pageable) = gateway.getAll(auth, pageable)

    @Get("/{id}")
    fun get(auth: Authentication, id: Long) = gateway.get(auth, id)

    @Post("search")
    fun search(auth: Authentication, @Body request: ReservationSearchRequest, pageable: Pageable) = gateway.search(auth, request, pageable)

    @Post()
    fun create(auth: Authentication, @Body request: ReservationChangeRequest) = gateway.create(auth, request)

    @Put("/{id}")
    fun update(auth: Authentication, id: Long, @Body request: ReservationChangeRequest) = gateway.update(auth, id, request)

    @Delete("/{id}")
    fun delete(auth: Authentication, id: Long) = gateway.delete(auth, id)


    @Get("/{id}/received/message")
    fun getRequestReceivedMessage(auth: Authentication, id: Long, @QueryValue(defaultValue = "en") lang: String) = gateway.getRequestReceivedMessage(auth, id, lang)

    @Get("/{id}/confirm/{offerId}/message")
    fun getConfirmationMessage(auth: Authentication, id: Long, offerId: Long, @QueryValue(defaultValue = "en") lang: String) = gateway.getConfirmationMessage(auth, id, offerId, lang)

    @Put("/{id}/confirm/{offerId}")
    fun confirm(auth: Authentication, id: Long, offerId: Long, @Body content: ReservationConfirmationContent) = gateway.confirm(auth, id, offerId, content)

    @Get("/{id}/deny/message")
    fun getDenialMessage(auth: Authentication, id: Long, @QueryValue(defaultValue = "en") lang: String) = gateway.getDenialMessage(auth, id, lang)

    @Put("/{id}/deny")
    fun deny(auth: Authentication, id: Long, @Body content: ReservationConfirmationContent) = gateway.deny(auth, id, content)

}