package de.sambalmueslie.openbooking.gateway.admin.booking

import de.sambalmueslie.openbooking.common.checkPermission
import de.sambalmueslie.openbooking.common.getEmail
import de.sambalmueslie.openbooking.common.getExternalId
import de.sambalmueslie.openbooking.common.getUsername
import de.sambalmueslie.openbooking.core.booking.BookingResponseService
import de.sambalmueslie.openbooking.core.booking.BookingService
import de.sambalmueslie.openbooking.core.booking.api.Booking
import de.sambalmueslie.openbooking.core.booking.api.BookingChangeRequest
import de.sambalmueslie.openbooking.core.booking.api.BookingConfirmationContent
import de.sambalmueslie.openbooking.core.booking.assembler.BookingDetailsAssembler
import de.sambalmueslie.openbooking.core.booking.assembler.BookingInfoAssembler
import de.sambalmueslie.openbooking.core.editor.EditorService
import de.sambalmueslie.openbooking.core.editor.api.EditorChangeRequest
import de.sambalmueslie.openbooking.core.search.booking.BookingSearchOperator
import de.sambalmueslie.openbooking.core.search.booking.api.BookingSearchRequest
import de.sambalmueslie.openbooking.gateway.admin.PERMISSION_BOOKING_ADMIN
import io.micronaut.data.model.Pageable
import io.micronaut.security.authentication.Authentication
import jakarta.inject.Singleton

@Singleton
class BookingGateway(
    private val service: BookingService,
    private val responseService: BookingResponseService,
    private val infoAssembler: BookingInfoAssembler,
    private val detailsAssembler: BookingDetailsAssembler,
    private val searchOperator: BookingSearchOperator,
    private val editorService: EditorService,
) {

    fun getAll(auth: Authentication, pageable: Pageable) = auth.checkPermission(PERMISSION_BOOKING_ADMIN) { service.getAll(pageable) }
    fun get(auth: Authentication, id: Long) = auth.checkPermission(PERMISSION_BOOKING_ADMIN) { service.get(id) }
    fun getInfo(auth: Authentication, id: Long) = auth.checkPermission(PERMISSION_BOOKING_ADMIN) { infoAssembler.get(id) }
    fun getDetails(auth: Authentication, id: Long) = auth.checkPermission(PERMISSION_BOOKING_ADMIN) { detailsAssembler.get(id) }
    fun search(auth: Authentication, request: BookingSearchRequest, pageable: Pageable) = auth.checkPermission(PERMISSION_BOOKING_ADMIN) { searchOperator.search(request, pageable) }

    fun create(auth: Authentication, request: BookingChangeRequest) = auth.checkPermission(PERMISSION_BOOKING_ADMIN) { service.create(request) }
    fun update(auth: Authentication, id: Long, request: BookingChangeRequest) = auth.checkPermission(PERMISSION_BOOKING_ADMIN) { service.update(id, request) }
    fun delete(auth: Authentication, id: Long) = auth.checkPermission(PERMISSION_BOOKING_ADMIN) { service.delete(id) }


    fun confirm(auth: Authentication, id: Long, content: BookingConfirmationContent) = auth.checkPermission(PERMISSION_BOOKING_ADMIN) { service.confirm(id, content) }
    fun getConfirmResponse(auth: Authentication, id: Long, lang: String) = auth.checkPermission(PERMISSION_BOOKING_ADMIN) { responseService.getConfirmResponse(id, lang) }

    fun decline(auth: Authentication, id: Long, content: BookingConfirmationContent) = auth.checkPermission(PERMISSION_BOOKING_ADMIN) { service.decline(id, content) }
    fun getDeclineResponse(auth: Authentication, id: Long, lang: String) = auth.checkPermission(PERMISSION_BOOKING_ADMIN) { responseService.getDeclineResponse(id, lang) }

    fun getPendingAmount(auth: Authentication) = auth.checkPermission(PERMISSION_BOOKING_ADMIN) { searchOperator.getPendingAmount() }

    fun getByOfferId(auth: Authentication, offerId: Long) = auth.checkPermission(PERMISSION_BOOKING_ADMIN) { service.getByOfferId(offerId) }
    fun getDetailByOfferId(auth: Authentication, offerId: Long) = auth.checkPermission(PERMISSION_BOOKING_ADMIN) { detailsAssembler.getByOfferId(offerId) }

    fun createEditor(auth: Authentication, id: Long) = auth.checkPermission(PERMISSION_BOOKING_ADMIN) {
        editorService.create(EditorChangeRequest(id, Booking::class, auth.getExternalId(), auth.getUsername().ifBlank { auth.getEmail() }))
    }

    fun refreshEditor(auth: Authentication, id: Long) = auth.checkPermission(PERMISSION_BOOKING_ADMIN) {
        editorService.refresh(id, Booking::class) ?: editorService.create(EditorChangeRequest(id, Booking::class, auth.getExternalId(), auth.getUsername().ifBlank { auth.getEmail() }))
    }

    fun deleteEditor(auth: Authentication, id: Long) = auth.checkPermission(PERMISSION_BOOKING_ADMIN) { editorService.deleteByResource(id, Booking::class) }
    fun getEditor(auth: Authentication, id: Long) = auth.checkPermission(PERMISSION_BOOKING_ADMIN) { editorService.getByResource(id, Booking::class) }


}