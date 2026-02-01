package de.sambalmueslie.openbooking.core.search.booking.api

import java.time.LocalDate

data class DailySeatStats(
    val date: LocalDate,
    val seats: Long
)