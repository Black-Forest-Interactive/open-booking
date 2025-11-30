package de.sambalmueslie.openbooking.gateway.portal.dashboard

import java.time.LocalDateTime


data class DashboardEntryOffer(
    val start: LocalDateTime,
    val spaceAvailable: Int,
    val spaceConfirmed: Int,
    val spaceUnconfirmed: Int,
    val spaceDeactivated: Int,
)