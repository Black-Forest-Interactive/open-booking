package de.sambalmueslie.openbooking.core.search.offer.api

import java.time.LocalDate

data class OfferStatistics(
    val totalActiveOfferSpace: Long,
    val totalDeactivatedOfferSpace: Long,
    val offersByDay: List<DailyOfferStats>,
    val spaceByDay: List<DailySpaceStats>,
    val avgConfirmedSpace: Double,
    val avgPendingSpace: Double,
    val avgAvailableSpace: Double,
    val totalMaxSpace: Long,
    val totalConfirmedSpace: Long,
    val totalPendingSpace: Long,
    val totalAvailableSpace: Long
)


data class DailyOfferStats(
    val date: LocalDate,
    val count: Long
)

data class DailySpaceStats(
    val date: LocalDate,
    val totalSpace: Long,
    val confirmedSpace: Long,
    val pendingSpace: Long,
    val availableSpace: Long
)