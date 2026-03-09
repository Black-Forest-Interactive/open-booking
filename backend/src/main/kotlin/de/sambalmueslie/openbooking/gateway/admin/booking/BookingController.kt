package de.sambalmueslie.openbooking.gateway.admin.booking

import de.sambalmueslie.openbooking.common.PatchRequest
import de.sambalmueslie.openbooking.core.booking.api.BookingChangeRequest
import de.sambalmueslie.openbooking.core.booking.api.BookingConfirmationContent
import de.sambalmueslie.openbooking.core.search.booking.api.BookingSearchRequest
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

    @Get("/{id}/info")
    fun getInfo(auth: Authentication, id: Long) = gateway.getInfo(auth, id)

    @Get("/{id}/details")
    fun getDetails(auth: Authentication, id: Long) = gateway.getDetails(auth, id)

    @Post("search")
    fun search(auth: Authentication, @Body request: BookingSearchRequest, pageable: Pageable) = gateway.search(auth, request, pageable)

    @Post()
    fun create(auth: Authentication, @Body request: BookingChangeRequest) = gateway.create(auth, request)

    @Put("/{id}")
    fun update(auth: Authentication, id: Long, @Body request: BookingChangeRequest) = gateway.update(auth, id, request)

    @Delete("/{id}")
    fun delete(auth: Authentication, id: Long) = gateway.delete(auth, id)

    @Put("/{id}/confirm")
    fun confirm(auth: Authentication, id: Long, @Body content: BookingConfirmationContent) = gateway.confirm(auth, id, content)

    @Get("/{id}/confirm/response")
    fun getConfirmResponse(auth: Authentication, id: Long, @QueryValue(defaultValue = "en") lang: String) = gateway.getConfirmResponse(auth, id, lang)

    @Put("/{id}/decline")
    fun decline(auth: Authentication, id: Long, @Body content: BookingConfirmationContent) = gateway.decline(auth, id, content)

    @Get("/{id}/decline/response")
    fun getDeclineResponse(auth: Authentication, id: Long, @QueryValue(defaultValue = "en") lang: String) = gateway.getDeclineResponse(auth, id, lang)

    @Get("pending/amount")
    fun getPendingAmount(auth: Authentication) = gateway.getPendingAmount(auth)

    @Post("{id}/editor")
    fun createEditor(auth: Authentication, id: Long) = gateway.createEditor(auth, id)

    @Put("{id}/editor")
    fun refreshEditor(auth: Authentication, id: Long) = gateway.refreshEditor(auth, id)

    @Delete("{id}/editor")
    fun deleteEditor(auth: Authentication, id: Long) = gateway.deleteEditor(auth, id)

    @Get("{id}/editor")
    fun getEditor(auth: Authentication, id: Long) = gateway.getEditor(auth, id)

    @Get("/by/offer/{offerId}")
    fun getByOfferId(auth: Authentication, offerId: Long) = gateway.getByOfferId(auth, offerId)

    @Get("/by/offer/{offerId}/details")
    fun getDetailByOfferId(auth: Authentication, offerId: Long) = gateway.getDetailByOfferId(auth, offerId)

    @Patch("{id}/comment")
    fun setComment(auth: Authentication, id: Long, @Body comment: PatchRequest<String>) = gateway.setComment(auth, id, comment.value)
}