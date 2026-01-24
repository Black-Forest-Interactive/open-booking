package de.sambalmueslie.openbooking.core.dashboard.api

import de.sambalmueslie.openbooking.core.booking.api.BookingStatus
import de.sambalmueslie.openbooking.core.offer.api.Assignment
import java.time.LocalDate

data class DaySummary(
    val date: LocalDate,
    val assignment: Assignment,
    val bookingStats: Map<BookingStatus, Int>,
    val recentlyChangedOffer: Int,
    val recentlyChangedBookings: Int,
)