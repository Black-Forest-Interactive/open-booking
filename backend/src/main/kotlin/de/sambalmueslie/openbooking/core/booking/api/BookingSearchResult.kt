package de.sambalmueslie.openbooking.core.booking.api

import de.sambalmueslie.openbooking.core.offer.api.Offer
import de.sambalmueslie.openbooking.core.visitor.api.Visitor

data class BookingSearchResult(
    val offer: Offer,
    val booking: Booking,
    val visitor: Visitor
)
