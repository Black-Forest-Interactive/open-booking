package de.sambalmueslie.openbooking.gateway.portal.reservation

import de.sambalmueslie.openbooking.common.GenericRequestResult
import de.sambalmueslie.openbooking.core.claim.ClaimService
import de.sambalmueslie.openbooking.core.reservation.ReservationService
import de.sambalmueslie.openbooking.core.reservation.api.Reservation
import de.sambalmueslie.openbooking.core.reservation.api.ReservationChangeRequest
import de.sambalmueslie.openbooking.core.response.api.ResolvedResponse
import de.sambalmueslie.openbooking.error.InvalidRequestException
import de.sambalmueslie.openbooking.gateway.portal.claim.ClaimGateway.Companion.CLAIM_KEY
import io.micronaut.session.Session
import jakarta.inject.Singleton

@Singleton
class ReservationGateway(
    private val service: ReservationService,
    private val claimService: ClaimService,
) {


    fun create(session: Session, request: CreateReservationRequest): Reservation {
        if (!request.termsAndConditions) throw InvalidRequestException("You must accept the terms and conditions")

        val claim = claimService.get(request.offerId)
        val claimedBySomeoneElse = claim != null && claim.userId != session.id
        if (claimedBySomeoneElse) throw InvalidRequestException("Offer is already claimed by someone else")
        if (claim != null) claimService.delete(claim.id)
        session.remove(CLAIM_KEY)

        return service.create(ReservationChangeRequest(request.visitor, request.comment, request.offerId, false, false))
    }

    fun getReservationReceivedMessage(id: Long, lang: String): ResolvedResponse? {
        return service.getReservationReceivedMessage(id, lang)
    }

    fun getReservationFailedMessage(id: Long, lang: String): ResolvedResponse? {
        return service.getReservationFailedMessage(id, lang)
    }

    fun confirmEmail(key: String): GenericRequestResult {
        return service.confirmEmail(key)
    }

}