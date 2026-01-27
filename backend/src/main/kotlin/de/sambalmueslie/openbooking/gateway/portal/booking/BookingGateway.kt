package de.sambalmueslie.openbooking.gateway.portal.booking

import de.sambalmueslie.openbooking.common.GenericRequestResult
import de.sambalmueslie.openbooking.common.PatchRequest
import de.sambalmueslie.openbooking.core.booking.BookingResponseService
import de.sambalmueslie.openbooking.core.booking.BookingService
import de.sambalmueslie.openbooking.core.booking.api.*
import de.sambalmueslie.openbooking.core.booking.assembler.BookingInfoAssembler
import de.sambalmueslie.openbooking.core.claim.ClaimService
import de.sambalmueslie.openbooking.core.response.api.ResolvedResponse
import de.sambalmueslie.openbooking.core.visitor.api.VisitorResizeRequest
import de.sambalmueslie.openbooking.gateway.portal.claim.ClaimGateway.Companion.CLAIM_KEY
import io.micronaut.session.Session
import jakarta.inject.Singleton
import org.slf4j.LoggerFactory

@Singleton
class BookingGateway(
    private val service: BookingService,
    private val responseService: BookingResponseService,
    private val infoAssembler: BookingInfoAssembler,
    private val claimService: ClaimService,
) {
    companion object {
        private val logger = LoggerFactory.getLogger(BookingGateway::class.java)
    }

    fun create(session: Session, request: CreateBookingRequest, lang: String): CreateBookingResponse {
        if (!request.termsAndConditions) throw BookingAcceptTermsRequired()

        val claim = claimService.get(request.offerId)
        val claimedBySomeoneElse = claim != null && claim.userId != session.id
        if (claimedBySomeoneElse) throw BookingClaimedBySomeoneElse()
        if (claim != null) claimService.delete(claim.id)
        session.remove(CLAIM_KEY)

        val r = BookingChangeRequest(request.visitor, request.comment, lang, request.offerId, false, false)
        return try {
            val result = service.create(r)
            val response = responseService.getReceivedResponse(result.id, lang)
            CreateBookingResponse(true, response ?: ResolvedResponse("", ""))
        } catch (e: Exception) {
            logger.error("[${session.id}] Error during creation", e)
            val response = responseService.getFailedResponse(r)
            CreateBookingResponse(false, response ?: ResolvedResponse("", ""))
        }
    }

    fun confirmEmail(key: String): GenericRequestResult {
        return service.confirmEmail(key)
    }

    fun get(key: String): PortalBooking? {
        return infoAssembler.getByKey(key).toPortal()
    }


    fun cancel(key: String): GenericRequestResult {
        return service.cancel(key)
    }

    fun updateComment(key: String, value: PatchRequest<String>): Booking? {
        return service.updateComment(key, value.value)
    }

    fun updateSize(key: String, request: VisitorResizeRequest): Booking? {
        return service.updateSize(key, BookingResizeRequest(request, false, false))
    }

    fun updatePhone(key: String, value: PatchRequest<String>): Booking? {
        return service.updatePhone(key, value.value)
    }

    fun updateEmail(key: String, value: PatchRequest<String>): Booking? {
        return service.updateEmail(key, value.value)
    }


    fun BookingInfo?.toPortal(): PortalBooking? {
        if (this == null) return null
        return PortalBooking(
            visitor,
            offer.offer,
            status,
            comment,
            timestamp
        )
    }
}