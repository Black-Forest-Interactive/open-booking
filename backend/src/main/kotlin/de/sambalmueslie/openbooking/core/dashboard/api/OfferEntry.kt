package de.sambalmueslie.openbooking.core.dashboard.api

import de.sambalmueslie.openbooking.core.guide.api.Guide
import java.time.LocalDateTime

data class OfferEntry(
    val id: Long,
    val start: LocalDateTime,
    val finish: LocalDateTime,
    val color: String,
    val totalSeats: Int,
    val confirmedSeats: Int,
    val pendingSeats: Int,
    val active: Boolean,
    val guide: Guide?,
    val bookings: List<BookingEntry>
)