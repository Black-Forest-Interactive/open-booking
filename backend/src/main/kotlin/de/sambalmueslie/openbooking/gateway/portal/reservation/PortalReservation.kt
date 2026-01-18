package de.sambalmueslie.openbooking.gateway.portal.reservation

import de.sambalmueslie.openbooking.core.offer.api.Offer
import de.sambalmueslie.openbooking.core.reservation.api.ReservationStatus
import de.sambalmueslie.openbooking.core.visitor.api.Visitor
import java.time.LocalDateTime

data class PortalReservation(
    val visitor: Visitor,
    val offer: Offer,
    val status: ReservationStatus,
    val comment: String,
    val timestamp: LocalDateTime
)
