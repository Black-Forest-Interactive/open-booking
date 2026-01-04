package de.sambalmueslie.openbooking.core.booking.api

import de.sambalmueslie.openbooking.core.offer.api.Offer
import de.sambalmueslie.openbooking.core.visitor.api.Visitor
import java.time.LocalDateTime

data class BookingInfo(
    val id: Long,
    val offer: Offer,
    val visitor: Visitor,
    val spaceAvailable: Int,
    val spaceConfirmed: Int,
    val status: BookingStatus,
    val timestamp: LocalDateTime
)