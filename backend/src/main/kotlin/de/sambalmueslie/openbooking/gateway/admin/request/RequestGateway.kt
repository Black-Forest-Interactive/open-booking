package de.sambalmueslie.openbooking.gateway.admin.request

import de.sambalmueslie.openbooking.common.PatchRequest
import de.sambalmueslie.openbooking.common.checkPermission
import de.sambalmueslie.openbooking.core.request.BookingRequestService
import de.sambalmueslie.openbooking.core.request.api.BookingConfirmationContent
import de.sambalmueslie.openbooking.core.request.api.BookingRequestChangeRequest
import de.sambalmueslie.openbooking.core.request.api.BookingRequestFilterRequest
import de.sambalmueslie.openbooking.core.visitor.api.VisitorChangeRequest
import de.sambalmueslie.openbooking.gateway.admin.PERMISSION_REQUEST_ADMIN
import io.micronaut.data.model.Pageable
import io.micronaut.security.authentication.Authentication
import jakarta.inject.Singleton

@Singleton
class RequestGateway(private val service: BookingRequestService) {

    fun getAll(auth: Authentication, pageable: Pageable) = auth.checkPermission(PERMISSION_REQUEST_ADMIN) { service.getAll(pageable) }
    fun get(auth: Authentication, id: Long) = auth.checkPermission(PERMISSION_REQUEST_ADMIN) { service.get(id) }
    fun create(auth: Authentication, request: BookingRequestChangeRequest) = auth.checkPermission(PERMISSION_REQUEST_ADMIN) { service.create(request) }

    fun update(auth: Authentication, id: Long, request: BookingRequestChangeRequest) = auth.checkPermission(PERMISSION_REQUEST_ADMIN) { service.update(id, request) }

    fun delete(auth: Authentication, id: Long) = auth.checkPermission(PERMISSION_REQUEST_ADMIN) { service.delete(id) }

    fun getUnconfirmed(auth: Authentication, pageable: Pageable) = auth.checkPermission(PERMISSION_REQUEST_ADMIN) { service.getUnconfirmed(pageable) }

    fun getInfoUnconfirmed(auth: Authentication, pageable: Pageable) = auth.checkPermission(PERMISSION_REQUEST_ADMIN) { service.getInfoUnconfirmed(pageable) }

    fun filterInfoUnconfirmed(auth: Authentication, filter: BookingRequestFilterRequest, pageable: Pageable) =
        auth.checkPermission(PERMISSION_REQUEST_ADMIN) { service.filterInfoUnconfirmed(filter, pageable) }

    fun getRequestReceivedMessage(auth: Authentication, id: Long, lang: String) = auth.checkPermission(PERMISSION_REQUEST_ADMIN) { service.getRequestReceivedMessage(id, lang) }

    fun getConfirmationMessage(auth: Authentication, id: Long, bookingId: Long, lang: String) = auth.checkPermission(PERMISSION_REQUEST_ADMIN) { service.getConfirmationMessage(id, bookingId, lang) }

    fun confirm(auth: Authentication, id: Long, bookingId: Long, content: BookingConfirmationContent) = auth.checkPermission(PERMISSION_REQUEST_ADMIN) { service.confirm(id, bookingId, content) }

    fun getDenialMessage(auth: Authentication, id: Long, lang: String) = auth.checkPermission(PERMISSION_REQUEST_ADMIN) { service.getDenialMessage(id, lang) }

    fun deny(auth: Authentication, id: Long, content: BookingConfirmationContent) = auth.checkPermission(PERMISSION_REQUEST_ADMIN) { service.deny(id, content) }

    fun getInfoByBookingId(auth: Authentication, bookingId: Long) = auth.checkPermission(PERMISSION_REQUEST_ADMIN) { service.getInfoByBookingId(bookingId) }

    fun updateVisitorGroup(auth: Authentication, id: Long, request: VisitorChangeRequest) = auth.checkPermission(PERMISSION_REQUEST_ADMIN) { service.updateVisitorGroup(id, request) }

    fun setComment(auth: Authentication, id: Long, value: PatchRequest<String>) = auth.checkPermission(PERMISSION_REQUEST_ADMIN) { service.setComment(id, value.value) }
}