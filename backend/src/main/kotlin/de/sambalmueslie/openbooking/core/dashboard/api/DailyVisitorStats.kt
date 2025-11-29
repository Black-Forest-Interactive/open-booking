package de.sambalmueslie.openbooking.core.dashboard.api

import de.sambalmueslie.openbooking.core.booking.api.BookingStatus
import java.time.LocalDate

data class DailyVisitorStats(
    val date: LocalDate,
    val offerAmount: Int,
    val activeOfferAmount: Int,
    val totalSpace: Int,
    val space: Map<BookingStatus, Int>,
)
