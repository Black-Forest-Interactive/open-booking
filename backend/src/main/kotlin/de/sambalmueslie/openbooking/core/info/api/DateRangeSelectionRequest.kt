package de.sambalmueslie.openbooking.core.info.api

import java.time.LocalDate

data class DateRangeSelectionRequest(
    val from: LocalDate,
    val to: LocalDate
)
