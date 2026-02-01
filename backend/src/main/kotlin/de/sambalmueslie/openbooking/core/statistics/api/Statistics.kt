package de.sambalmueslie.openbooking.core.statistics.api

import de.sambalmueslie.openbooking.core.booking.api.BookingStatus
import de.sambalmueslie.openbooking.core.search.booking.api.BookingStatusStats
import de.sambalmueslie.openbooking.core.search.offer.api.DailyOfferStats
import de.sambalmueslie.openbooking.core.search.offer.api.DailySpaceStats
import de.sambalmueslie.openbooking.core.visitor.api.VerificationStatus
import de.sambalmueslie.openbooking.core.visitor.api.VisitorType

data class Statistics(
    val totalActiveOfferSpace: Long,
    val totalDeactivatedOfferSpace: Long,
    val offersByDay: List<DailyOfferStats>,
    val spaceByDay: List<DailySpaceStats>,
    val bookingStatusDistribution: Map<BookingStatus, BookingStatusStats>,
    val visitorTypeDistribution: Map<VisitorType, Long>,
    val verificationStatusDistribution: Map<VerificationStatus, Long>,
    val avgConfirmedSpace: Double,
    val avgPendingSpace: Double,
    val avgAvailableSpace: Double,
    val totalMaxSpace: Long,
    val totalConfirmedSpace: Long,
    val totalPendingSpace: Long,
    val totalAvailableSpace: Long
)
