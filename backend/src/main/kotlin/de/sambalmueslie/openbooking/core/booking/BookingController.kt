package de.sambalmueslie.openbooking.core.booking


import de.sambalmueslie.openbooking.core.booking.api.BookingAPI
import de.sambalmueslie.openbooking.core.booking.api.BookingAPI.Companion.PERMISSION_READ
import de.sambalmueslie.openbooking.core.booking.api.BookingAPI.Companion.PERMISSION_WRITE
import de.sambalmueslie.openbooking.core.booking.api.BookingChangeRequest
import de.sambalmueslie.openbooking.core.booking.api.BookingSearchRequest
import de.sambalmueslie.openbooking.common.checkPermission
import io.micronaut.data.model.Pageable
import io.micronaut.http.annotation.*
import io.micronaut.security.authentication.Authentication
import io.swagger.v3.oas.annotations.tags.Tag

@Controller("/api/backend/booking")
@Tag(name = "Booking API")
@Deprecated("move that to gateway")
class BookingController(private val service: BookingService) : BookingAPI {


    @Get()
    override fun getAll(auth: Authentication, pageable: Pageable) = auth.checkPermission(PERMISSION_READ) { service.getAll(pageable) }

    @Get("/{id}")
    override fun get(auth: Authentication, @PathVariable id: Long) = auth.checkPermission(PERMISSION_READ) { service.get(id) }

    @Post()
    override fun create(auth: Authentication, @Body request: BookingChangeRequest) =
        auth.checkPermission(PERMISSION_WRITE) { service.create(request) }

    @Put("/{id}")
    override fun update(auth: Authentication, @PathVariable id: Long, @Body request: BookingChangeRequest) =
        auth.checkPermission(PERMISSION_WRITE) { service.update(id, request) }

    @Delete("/{id}")
    override fun delete(auth: Authentication, @PathVariable id: Long) =
        auth.checkPermission(PERMISSION_WRITE) { service.delete(id) }


    @Get("/by/offer/{offerId}")
    override fun findByOffer(auth: Authentication, @PathVariable offerId: Long) =
        auth.checkPermission(PERMISSION_READ) { service.findByOffer(offerId) }

    @Get("/by/offer/{offerId}/details")
    override fun findDetailsByOffer(auth: Authentication, @PathVariable offerId: Long) =
        auth.checkPermission(PERMISSION_READ) { service.findDetailsByOffer(offerId) }

    @Post("/search")
    override fun searchDetails(auth: Authentication, @Body request: BookingSearchRequest, pageable: Pageable) =
        auth.checkPermission(PERMISSION_READ) { service.searchDetails(request, pageable) }
}
