package de.sambalmueslie.openbooking.core.request


import de.sambalmueslie.openbooking.core.group.api.VisitorGroupChangeRequest
import de.sambalmueslie.openbooking.core.request.api.BookingConfirmationContent
import de.sambalmueslie.openbooking.core.request.api.BookingRequestAPI
import de.sambalmueslie.openbooking.core.request.api.BookingRequestAPI.Companion.PERMISSION_READ
import de.sambalmueslie.openbooking.core.request.api.BookingRequestAPI.Companion.PERMISSION_WRITE
import de.sambalmueslie.openbooking.core.request.api.BookingRequestChangeRequest
import de.sambalmueslie.openbooking.core.request.api.BookingRequestFilterRequest
import de.sambalmueslie.openbooking.common.PatchRequest
import de.sambalmueslie.openbooking.common.checkPermission
import io.micronaut.data.model.Pageable
import io.micronaut.http.annotation.*
import io.micronaut.security.authentication.Authentication
import io.swagger.v3.oas.annotations.tags.Tag

@Controller("/api/backend/request")
@Tag(name = "Booking Request API")
@Deprecated("move that to gateway")
class BookingRequestController(private val service: BookingRequestService) : BookingRequestAPI {
    @Get()
    override fun getAll(auth: Authentication, pageable: Pageable) = auth.checkPermission(PERMISSION_READ) { service.getAll(pageable) }

    @Get("/{id}")
    override fun get(auth: Authentication, @PathVariable id: Long) = auth.checkPermission(PERMISSION_READ) { service.get(id) }

    @Post()
    override fun create(auth: Authentication, @Body request: BookingRequestChangeRequest) =
        auth.checkPermission(PERMISSION_WRITE) { service.create(request) }

    @Put("/{id}")
    override fun update(auth: Authentication, @PathVariable id: Long, @Body request: BookingRequestChangeRequest) =
        auth.checkPermission(PERMISSION_WRITE) { service.update(id, request) }

    @Delete("/{id}")
    override fun delete(auth: Authentication, @PathVariable id: Long) =
        auth.checkPermission(PERMISSION_WRITE) { service.delete(id) }

    @Get("/unconfirmed")
    override fun getUnconfirmed(auth: Authentication, pageable: Pageable) =
        auth.checkPermission(PERMISSION_READ) { service.getUnconfirmed(pageable) }

    @Get("/unconfirmed/info")
    override fun getInfoUnconfirmed(auth: Authentication, pageable: Pageable) =
        auth.checkPermission(PERMISSION_READ) { service.getInfoUnconfirmed(pageable) }

    @Post("/unconfirmed/info")
    override fun filterInfoUnconfirmed(auth: Authentication, @Body filter: BookingRequestFilterRequest, pageable: Pageable)=
        auth.checkPermission(PERMISSION_READ) { service.filterInfoUnconfirmed(filter, pageable) }

    @Get("/{id}/received/message")
    override fun getRequestReceivedMessage(auth: Authentication, id: Long, @QueryValue(defaultValue = "en") lang: String) =
        auth.checkPermission(PERMISSION_READ) { service.getRequestReceivedMessage(id, lang) }

    @Get("/{id}/confirm/{bookingId}/message")
    override fun getConfirmationMessage(auth: Authentication, id: Long, bookingId: Long, @QueryValue(defaultValue = "en") lang: String) =
        auth.checkPermission(PERMISSION_READ) { service.getConfirmationMessage(id, bookingId, lang) }

    @Put("/{id}/confirm/{bookingId}")
    override fun confirm(auth: Authentication, @PathVariable id: Long, @PathVariable bookingId: Long, @Body content: BookingConfirmationContent) =
        auth.checkPermission(PERMISSION_WRITE) { service.confirm(id, bookingId, content) }

    @Get("/{id}/deny/message")
    override fun getDenialMessage(auth: Authentication, id: Long, @QueryValue(defaultValue = "en") lang: String) =
        auth.checkPermission(PERMISSION_READ) { service.getDenialMessage(id,  lang) }

    @Put("/{id}/deny")
    override fun deny(auth: Authentication, @PathVariable id: Long, @Body content: BookingConfirmationContent) =
        auth.checkPermission(PERMISSION_WRITE) { service.deny(id, content) }

    @Get("/info/by/booking/{bookingId}")
    override fun getInfoByBookingId(auth: Authentication, bookingId: Long)=
        auth.checkPermission(PERMISSION_READ) { service.getInfoByBookingId(bookingId) }

    @Put("/{id}/visitor")
    override fun updateVisitorGroup(auth: Authentication, @PathVariable id: Long, @Body request: VisitorGroupChangeRequest)  =
        auth.checkPermission(PERMISSION_WRITE) { service.updateVisitorGroup(id, request) }

    @Patch("/{id}/comment")
    override fun setComment(auth: Authentication, id: Long, @Body value: PatchRequest<String>) =
        auth.checkPermission(PERMISSION_WRITE) { service.setComment(id, value.value) }

}
