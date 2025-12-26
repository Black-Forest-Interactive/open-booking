package de.sambalmueslie.openbooking.gateway.portal.dashboard

import java.time.LocalDate

data class DashboardEntrySearchRequest(
    val from: LocalDate?,
    val to: LocalDate?
)
