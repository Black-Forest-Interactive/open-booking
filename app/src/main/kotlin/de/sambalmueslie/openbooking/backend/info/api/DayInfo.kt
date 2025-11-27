package de.sambalmueslie.openbooking.backend.info.api

import java.time.LocalDate
import java.time.LocalDateTime

data class DayInfo(
    val date: LocalDate,
    val start: LocalDateTime,
    val end: LocalDateTime,

    val offer: List<DayInfoOffer>
)
