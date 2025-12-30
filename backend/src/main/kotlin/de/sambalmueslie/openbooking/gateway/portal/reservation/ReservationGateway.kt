package de.sambalmueslie.openbooking.gateway.portal.reservation

import de.sambalmueslie.openbooking.common.GenericRequestResult
import de.sambalmueslie.openbooking.core.reservation.ReservationService
import de.sambalmueslie.openbooking.core.reservation.api.Reservation
import de.sambalmueslie.openbooking.core.reservation.api.ReservationChangeRequest
import de.sambalmueslie.openbooking.core.response.api.ResolvedResponse
import de.sambalmueslie.openbooking.error.InvalidRequestException
import jakarta.inject.Singleton

@Singleton
class ReservationGateway(
    private val service: ReservationService
) {
    fun create(request: CreateReservationRequest): Reservation {
        if (!request.termsAndConditions) throw InvalidRequestException("You must accept the terms and conditions")
        return service.create(ReservationChangeRequest(request.visitor, request.comment, request.offerIds, false, false))
    }

    fun getRequestReceivedMessage(requestId: Long, lang: String): ResolvedResponse? {
        return service.getRequestReceivedMessage(requestId, lang)
    }

    fun confirmEmail(key: String): GenericRequestResult {
        return service.confirmEmail(key)
    }
}