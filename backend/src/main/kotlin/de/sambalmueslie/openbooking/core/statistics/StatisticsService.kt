package de.sambalmueslie.openbooking.core.statistics

import de.sambalmueslie.openbooking.core.search.booking.BookingSearchOperator
import de.sambalmueslie.openbooking.core.search.offer.OfferSearchOperator
import de.sambalmueslie.openbooking.core.statistics.api.Statistics
import jakarta.inject.Singleton

@Singleton
class StatisticsService(
    private val bookingSearchOperator: BookingSearchOperator,
    private val offerSearchOperator: OfferSearchOperator,
) {

    fun get(): Statistics {
        val offer = offerSearchOperator.getOfferStatistics()
        val booking = bookingSearchOperator.getBookingStatistics()

        return Statistics(
            offer.totalActiveOfferSpace,
            offer.totalDeactivatedOfferSpace,
            offer.offersByDay,
            offer.spaceByDay,
            booking.statusDistribution,
            booking.visitorTypeDistribution,
            booking.verificationStatusDistribution,
            offer.avgConfirmedSpace,
            offer.avgPendingSpace,
            offer.avgAvailableSpace,
            offer.totalMaxSpace,
            offer.totalConfirmedSpace,
            offer.totalPendingSpace,
            offer.totalAvailableSpace
        )
    }
}