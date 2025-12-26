package de.sambalmueslie.openbooking.core.info.api

import java.time.LocalDate
import java.time.LocalDateTime

data class DayInfo(
    val date: LocalDate,
    val start: LocalDateTime,
    val end: LocalDateTime,

    val offer: List<DayInfoOffer>
)
