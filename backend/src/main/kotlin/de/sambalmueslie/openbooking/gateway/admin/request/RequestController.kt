package de.sambalmueslie.openbooking.gateway.admin.request

import de.sambalmueslie.openbooking.common.PatchRequest
import de.sambalmueslie.openbooking.core.request.api.BookingConfirmationContent
import de.sambalmueslie.openbooking.core.request.api.BookingRequestChangeRequest
import de.sambalmueslie.openbooking.core.request.api.BookingRequestFilterRequest
import de.sambalmueslie.openbooking.core.visitor.api.VisitorChangeRequest
import io.micronaut.data.model.Pageable
import io.micronaut.http.annotation.*
import io.micronaut.security.authentication.Authentication
import io.swagger.v3.oas.annotations.tags.Tag


@Controller("/api/admin/request")
@Tag(name = "Admin Request API")
class RequestController(private val gateway: RequestGateway) {
    @Get()
    fun getAll(auth: Authentication, pageable: Pageable) = gateway.getAll(auth, pageable)

    @Get("/{id}")
    fun get(auth: Authentication, id: Long) = gateway.get(auth, id)

    @Post()
    fun create(auth: Authentication, @Body request: BookingRequestChangeRequest) = gateway.create(auth, request)

    @Put("/{id}")
    fun update(auth: Authentication, id: Long, @Body request: BookingRequestChangeRequest) = gateway.update(auth, id, request)

    @Delete("/{id}")
    fun delete(auth: Authentication, id: Long) = gateway.delete(auth, id)

    @Get("/unconfirmed")
    fun getUnconfirmed(auth: Authentication, pageable: Pageable) = gateway.getUnconfirmed(auth, pageable)

    @Get("/unconfirmed/info")
    fun getInfoUnconfirmed(auth: Authentication, pageable: Pageable) = gateway.getInfoUnconfirmed(auth, pageable)

    @Post("/unconfirmed/info")
    fun filterInfoUnconfirmed(auth: Authentication, @Body filter: BookingRequestFilterRequest, pageable: Pageable) = gateway.filterInfoUnconfirmed(auth, filter, pageable)

    @Get("/{id}/received/message")
    fun getRequestReceivedMessage(auth: Authentication, id: Long, @QueryValue(defaultValue = "en") lang: String) = gateway.getRequestReceivedMessage(auth, id, lang)

    @Get("/{id}/confirm/{bookingId}/message")
    fun getConfirmationMessage(auth: Authentication, id: Long, bookingId: Long, @QueryValue(defaultValue = "en") lang: String) = gateway.getConfirmationMessage(auth, id, bookingId, lang)

    @Put("/{id}/confirm/{bookingId}")
    fun confirm(auth: Authentication, id: Long, bookingId: Long, @Body content: BookingConfirmationContent) = gateway.confirm(auth, id, bookingId, content)

    @Get("/{id}/deny/message")
    fun getDenialMessage(auth: Authentication, id: Long, @QueryValue(defaultValue = "en") lang: String) = gateway.getDenialMessage(auth, id, lang)

    @Put("/{id}/deny")
    fun deny(auth: Authentication, id: Long, @Body content: BookingConfirmationContent) = gateway.deny(auth, id, content)

    @Get("/info/by/booking/{bookingId}")
    fun getInfoByBookingId(auth: Authentication, bookingId: Long) = gateway.getInfoByBookingId(auth, bookingId)

    @Put("/{id}/visitor")
    fun updateVisitorGroup(auth: Authentication, id: Long, @Body request: VisitorChangeRequest) = gateway.updateVisitorGroup(auth, id, request)

    @Patch("/{id}/comment")
    fun setComment(auth: Authentication, id: Long, @Body value: PatchRequest<String>) = gateway.setComment(auth, id, value)
}