package de.sambalmueslie.openbooking.gateway.portal.dashboard

import java.time.LocalDate
import java.time.LocalDateTime

data class DashboardEntry(
    val date: LocalDate,
    val start: LocalDateTime,
    val end: LocalDateTime,

    val offer: List<DashboardEntryOffer>
)

