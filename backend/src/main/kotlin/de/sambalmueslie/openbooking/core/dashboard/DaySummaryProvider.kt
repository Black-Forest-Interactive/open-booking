package de.sambalmueslie.openbooking.core.dashboard

import de.sambalmueslie.openbooking.common.Entity
import de.sambalmueslie.openbooking.common.TimeProvider
import de.sambalmueslie.openbooking.common.measureTimeMillisWithReturn
import de.sambalmueslie.openbooking.core.booking.api.BookingStatus
import de.sambalmueslie.openbooking.core.dashboard.api.DaySummary
import de.sambalmueslie.openbooking.core.offer.api.Assignment
import de.sambalmueslie.openbooking.core.search.offer.OfferSearchOperator
import de.sambalmueslie.openbooking.core.search.offer.api.OfferSearchRequest
import io.micronaut.data.model.Pageable
import jakarta.inject.Singleton
import org.slf4j.LoggerFactory
import java.time.Duration
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import java.time.temporal.ChronoUnit

@Singleton
class DaySummaryProvider(
    private val offerSearchService: OfferSearchOperator,
    private val timeProvider: TimeProvider
) {

    companion object {
        private val logger = LoggerFactory.getLogger(DaySummaryProvider::class.java)
        private val recentThreshold = Duration.ofMinutes(30)
    }

    fun getDaySummary(from: LocalDate, to: LocalDate): List<DaySummary> {
        val timestamp = timeProvider.now()
        val days = ChronoUnit.DAYS.between(from, to)
        return (0..days).map { from.plusDays(it) }
            .map { getDaySummary(it, timestamp) }
    }

    private fun getDaySummary(date: LocalDate, timestamp: LocalDateTime): DaySummary {
        val (duration, result) = measureTimeMillisWithReturn {
            val start = date.atStartOfDay()
            val end = start.plusDays(1)
            val offerResponse = offerSearchService.search(OfferSearchRequest("", start, end), Pageable.from(0, 10000))

            var confirmedSpace = 0
            var pendingSpace = 0
            var availableSpace = 0
            var deactivatedSpace = 0
            var recentlyChangedOffer = 0
            var recentlyChangedBookings = 0
            val bookingStats = mutableMapOf<BookingStatus, Int>()

            offerResponse.result.content.forEach { o ->
                confirmedSpace += o.assignment.confirmedSpace
                pendingSpace += o.assignment.pendingSpace
                availableSpace += o.assignment.availableSpace
                deactivatedSpace += o.assignment.deactivatedSpace

                if (isRecentlyChanged(o.info.offer, timestamp)) recentlyChangedOffer++
                o.bookings.forEach { b ->
                    val bookingStatsEntry = bookingStats.getOrPut(b.booking.status) { 0 }
                    bookingStats[b.booking.status] = bookingStatsEntry + 1
                    if (isRecentlyChanged(b.booking, timestamp)) recentlyChangedBookings++
                }

            }

            val dailyAssigment = Assignment(confirmedSpace, pendingSpace, availableSpace, deactivatedSpace)
            DaySummary(date, dailyAssigment, bookingStats, recentlyChangedOffer, recentlyChangedBookings)
        }
        logger.info("[${date.format(DateTimeFormatter.ISO_LOCAL_DATE)}] day summary created within $duration ms.")
        return result
    }


    private fun isRecentlyChanged(entity: Entity<Long>, timestamp: LocalDateTime): Boolean {
        val changed = entity.updated ?: entity.created
        return changed.isAfter(timestamp.minus(recentThreshold))
    }
}