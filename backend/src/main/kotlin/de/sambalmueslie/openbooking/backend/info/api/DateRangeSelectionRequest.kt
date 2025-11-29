package de.sambalmueslie.openbooking.backend.info.api

import java.time.LocalDate

data class DateRangeSelectionRequest(
    val from: LocalDate,
    val to: LocalDate
)
