package de.sambalmueslie.openbooking.core.offer.api

import de.sambalmueslie.openbooking.core.booking.api.BookingDetails
import de.sambalmueslie.openbooking.core.guide.api.Guide
import de.sambalmueslie.openbooking.core.label.api.Label
import java.time.LocalDateTime

data class OfferDetails(
    val offer: Offer,
    val label: Label?,
    val guide: Guide?,
    val assignment: Assignment,
    val bookings: List<BookingDetails>,
    val timestamp: LocalDateTime
)
