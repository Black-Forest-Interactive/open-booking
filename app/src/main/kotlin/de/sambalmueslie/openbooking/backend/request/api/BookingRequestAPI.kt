package de.sambalmueslie.openbooking.backend.request.api

import de.sambalmueslie.openbooking.backend.group.api.VisitorGroupChangeRequest
import de.sambalmueslie.openbooking.backend.response.api.ResolvedResponse
import de.sambalmueslie.openbooking.common.AuthCrudAPI
import de.sambalmueslie.openbooking.common.GenericRequestResult
import de.sambalmueslie.openbooking.common.PatchRequest
import io.micronaut.data.model.Page
import io.micronaut.data.model.Pageable
import io.micronaut.security.authentication.Authentication

interface BookingRequestAPI : AuthCrudAPI<Long, BookingRequest, BookingRequestChangeRequest> {
    companion object {
        const val PERMISSION_READ = "openbooking.bookingrequest.read"
        const val PERMISSION_WRITE = "openbooking.bookingrequest.write"
    }

    fun getUnconfirmed(auth: Authentication, pageable: Pageable): Page<BookingRequest>

    fun getInfoUnconfirmed(auth: Authentication, pageable: Pageable): Page<BookingRequestInfo>
    fun filterInfoUnconfirmed(auth: Authentication, filter: BookingRequestFilterRequest, pageable: Pageable): Page<BookingRequestInfo>

    fun getRequestReceivedMessage(auth: Authentication, id: Long, lang: String): ResolvedResponse?
    fun getConfirmationMessage(auth: Authentication, id: Long, bookingId: Long, lang: String): ResolvedResponse?
    fun getDenialMessage(auth: Authentication, id: Long, lang: String): ResolvedResponse?

    fun confirm(auth: Authentication, id: Long, bookingId: Long, content: BookingConfirmationContent): GenericRequestResult
    fun deny(auth: Authentication, id: Long, content: BookingConfirmationContent): GenericRequestResult

    fun getInfoByBookingId(auth: Authentication, bookingId: Long): BookingRequestInfo?

    fun updateVisitorGroup(auth: Authentication, id: Long, request: VisitorGroupChangeRequest): GenericRequestResult

    fun setComment(auth: Authentication, id: Long, value: PatchRequest<String>): BookingRequest?
}
