package de.sambalmueslie.openbooking.backend.dashboard.api

import de.sambalmueslie.openbooking.backend.booking.api.BookingStatus
import java.time.LocalDate

data class DailyVisitorStats(
    val date: LocalDate,
    val offerAmount: Int,
    val activeOfferAmount: Int,
    val totalSpace: Int,
    val space: Map<BookingStatus, Int>,
)
