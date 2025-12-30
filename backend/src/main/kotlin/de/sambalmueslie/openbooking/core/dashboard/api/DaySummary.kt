package de.sambalmueslie.openbooking.core.dashboard.api

import java.time.LocalDate

data class DaySummary(
    val date: LocalDate,
    val unconfirmedCount: Int
)