package de.sambalmueslie.openbooking.core.reservation.api

import de.sambalmueslie.openbooking.core.visitor.api.Visitor
import java.time.LocalDateTime

data class ReservationInfo(
    val id: Long,
    val visitor: Visitor,
    val offer: List<ReservationOfferReference>,
    val status: ReservationStatus,
    val comment: String,
    val timestamp: LocalDateTime
)
