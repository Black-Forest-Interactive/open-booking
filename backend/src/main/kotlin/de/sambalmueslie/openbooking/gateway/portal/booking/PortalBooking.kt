package de.sambalmueslie.openbooking.gateway.portal.booking

import de.sambalmueslie.openbooking.core.booking.api.BookingStatus
import de.sambalmueslie.openbooking.core.offer.api.Offer
import de.sambalmueslie.openbooking.core.visitor.api.Visitor
import java.time.LocalDateTime

data class PortalBooking(
    val visitor: Visitor,
    val offer: Offer,
    val status: BookingStatus,
    val comment: String,
    val timestamp: LocalDateTime
)
