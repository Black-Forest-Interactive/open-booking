package de.sambalmueslie.openbooking.core.booking.api

import de.sambalmueslie.openbooking.core.offer.api.OfferInfo
import de.sambalmueslie.openbooking.core.visitor.api.Visitor
import java.time.LocalDateTime

data class BookingInfo(
    val id: Long,
    val visitor: Visitor,
    val offer: OfferInfo,
    val status: BookingStatus,
    val comment: String,
    val timestamp: LocalDateTime
)