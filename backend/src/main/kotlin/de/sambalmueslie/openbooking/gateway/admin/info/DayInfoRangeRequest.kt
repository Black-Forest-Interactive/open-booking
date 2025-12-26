package de.sambalmueslie.openbooking.gateway.admin.info

import java.time.LocalDate

data class DayInfoRangeRequest(
    val from: LocalDate?,
    val to: LocalDate?
)