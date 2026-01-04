package de.sambalmueslie.openbooking.core.search.offer.api

import de.sambalmueslie.openbooking.core.reservation.api.ReservationStatus
import de.sambalmueslie.openbooking.core.visitor.api.Visitor

data class OfferReservationEntry(
    val reservationId: Long,
    val status: ReservationStatus,
    val visitor: Visitor
)
