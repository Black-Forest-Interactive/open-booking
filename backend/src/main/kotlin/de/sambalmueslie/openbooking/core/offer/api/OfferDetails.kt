package de.sambalmueslie.openbooking.core.offer.api

import de.sambalmueslie.openbooking.core.booking.api.BookingDetails
import java.time.LocalDateTime

data class OfferDetails(
    val offer: Offer,
    val assignment: Assignment,
    val bookings: List<BookingDetails>,
    val timestamp: LocalDateTime
)
