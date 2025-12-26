package de.sambalmueslie.openbooking.gateway.admin.booking

import de.sambalmueslie.openbooking.core.booking.api.BookingChangeRequest
import de.sambalmueslie.openbooking.core.booking.api.BookingSearchRequest
import io.micronaut.data.model.Pageable
import io.micronaut.http.annotation.*
import io.micronaut.security.authentication.Authentication
import io.swagger.v3.oas.annotations.tags.Tag

@Controller("/api/admin/booking")
@Tag(name = "Admin Booking API")
class BookingController(private val gateway: BookingGateway) {
    @Get()
    fun getAll(auth: Authentication, pageable: Pageable) = gateway.getAll(auth, pageable)

    @Get("/{id}")
    fun get(auth: Authentication, id: Long) = gateway.get(auth, id)

    @Post()
    fun create(auth: Authentication, @Body request: BookingChangeRequest) = gateway.create(auth, request)

    @Put("/{id}")
    fun update(auth: Authentication, id: Long, @Body request: BookingChangeRequest) = gateway.update(auth, id, request)

    @Delete("/{id}")
    fun delete(auth: Authentication, id: Long) = gateway.delete(auth, id)

    @Get("/by/offer/{offerId}")
    fun findByOffer(auth: Authentication, offerId: Long) = gateway.findByOffer(auth, offerId)

    @Get("/by/offer/{offerId}/details")
    fun findDetailsByOffer(auth: Authentication, offerId: Long) = gateway.findDetailsByOffer(auth, offerId)

    @Post("/search")
    fun searchDetails(auth: Authentication, @Body request: BookingSearchRequest, pageable: Pageable) = gateway.searchDetails(auth, request, pageable)
}