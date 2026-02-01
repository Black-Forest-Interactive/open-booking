package de.sambalmueslie.openbooking.core.search.booking.api

import java.time.LocalDate

data class DailyBookingStats(
    val date: LocalDate,
    val count: Long
)