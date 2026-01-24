package de.sambalmueslie.openbooking.core.search.offer.api

import de.sambalmueslie.openbooking.core.booking.api.BookingDetails
import de.sambalmueslie.openbooking.core.offer.api.Assignment
import de.sambalmueslie.openbooking.core.offer.api.OfferInfo

data class OfferSearchEntry(
    val info: OfferInfo,
    val assignment: Assignment,
    val bookings: List<BookingDetails>
)
