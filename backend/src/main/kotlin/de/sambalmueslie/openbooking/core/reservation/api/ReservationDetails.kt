package de.sambalmueslie.openbooking.core.reservation.api

import de.sambalmueslie.openbooking.core.visitor.api.Visitor

data class ReservationDetails(
    val reservation: Reservation,
    val visitor: Visitor,
    val offerIds: Set<Long>
)
