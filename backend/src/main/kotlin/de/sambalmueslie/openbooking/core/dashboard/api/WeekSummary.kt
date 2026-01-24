package de.sambalmueslie.openbooking.core.dashboard.api

import java.time.LocalDate

data class WeekSummary(
    val weekNumber: Int,
    val startDate: LocalDate,
    val endDate: LocalDate
)