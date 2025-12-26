package de.sambalmueslie.openbooking.core.booking.api

import de.sambalmueslie.openbooking.core.group.api.VisitorGroup
import de.sambalmueslie.openbooking.core.offer.api.Offer

data class BookingSearchResult(
    val offer: Offer,
    val booking: Booking,
    val visitorGroup: VisitorGroup
)
