package de.sambalmueslie.openbooking.core.search.reservation.api

import de.sambalmueslie.openbooking.core.reservation.api.Reservation
import de.sambalmueslie.openbooking.core.reservation.api.ReservationOfferEntry
import de.sambalmueslie.openbooking.core.visitor.api.Visitor
import java.time.LocalDateTime

data class ReservationSearchEntry(
    val reservation: Reservation,
    val visitor: Visitor,
    val offers: List<ReservationOfferEntry>,
    val timestamp: LocalDateTime
)
