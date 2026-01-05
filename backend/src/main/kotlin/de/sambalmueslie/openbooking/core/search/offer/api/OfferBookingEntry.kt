package de.sambalmueslie.openbooking.core.search.offer.api

import de.sambalmueslie.openbooking.core.booking.api.BookingStatus
import de.sambalmueslie.openbooking.core.visitor.api.Visitor

data class OfferBookingEntry(
    val bookingId: Long,
    val status: BookingStatus,
    val visitor: Visitor
)
