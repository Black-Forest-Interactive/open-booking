package de.sambalmueslie.openbooking.backend.booking.api

import de.sambalmueslie.openbooking.backend.group.api.VisitorGroup
import de.sambalmueslie.openbooking.backend.offer.api.Offer

data class BookingSearchResult(
    val offer: Offer,
    val booking: Booking,
    val visitorGroup: VisitorGroup
)
