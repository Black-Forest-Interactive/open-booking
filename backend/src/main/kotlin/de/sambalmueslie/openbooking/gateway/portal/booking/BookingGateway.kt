package de.sambalmueslie.openbooking.gateway.portal.booking

import com.fasterxml.jackson.databind.ObjectMapper
import de.sambalmueslie.openbooking.common.GenericRequestResult
import de.sambalmueslie.openbooking.core.request.BookingRequestService
import de.sambalmueslie.openbooking.core.request.api.BookingRequest
import de.sambalmueslie.openbooking.core.request.api.BookingRequestChangeRequest
import de.sambalmueslie.openbooking.core.response.api.ResolvedResponse
import de.sambalmueslie.openbooking.error.InvalidRequestException
import de.sambalmueslie.openbooking.frontend.user.api.CreateBookingRequest
import jakarta.inject.Singleton
import org.slf4j.LoggerFactory

@Singleton
class BookingGateway(
    private val bookingRequestService: BookingRequestService,
    private val mapper: ObjectMapper
) {
    companion object {
        private val logger = LoggerFactory.getLogger(BookingGateway::class.java)
    }

    fun create(request: CreateBookingRequest): BookingRequest {
        if (!request.termsAndConditions) throw InvalidRequestException("You must accept the terms and conditions")
        if (logger.isDebugEnabled) logger.debug("Create booking ${mapper.writeValueAsString(request)}")
        return bookingRequestService.create(BookingRequestChangeRequest(request.visitorGroupChangeRequest, request.offerIds, request.comment, false, false))
    }
    
    fun getRequestReceivedMessage(requestId: Long, lang: String): ResolvedResponse? {
        return bookingRequestService.getRequestReceivedMessage(requestId, lang)
    }

    fun confirmEmail(key: String): GenericRequestResult {
        return bookingRequestService.confirmEmail(key)
    }

}