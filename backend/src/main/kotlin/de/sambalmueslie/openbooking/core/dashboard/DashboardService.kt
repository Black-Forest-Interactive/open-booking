package de.sambalmueslie.openbooking.core.dashboard


import de.sambalmueslie.openbooking.common.PageableSequence
import de.sambalmueslie.openbooking.common.measureTimeMillisWithReturn
import de.sambalmueslie.openbooking.core.booking.BookingService
import de.sambalmueslie.openbooking.core.booking.api.BookingStatus
import de.sambalmueslie.openbooking.core.dashboard.api.DailyVisitorStats
import de.sambalmueslie.openbooking.core.dashboard.api.DaySummary
import de.sambalmueslie.openbooking.core.dashboard.api.WeekSummary
import de.sambalmueslie.openbooking.core.offer.OfferService
import jakarta.inject.Singleton
import org.slf4j.LoggerFactory
import java.time.DayOfWeek
import java.time.LocalDate
import java.time.temporal.ChronoUnit
import java.time.temporal.TemporalAdjusters

@Singleton
class DashboardService(
    private val offerService: OfferService,
    private val bookingService: BookingService
) {

    companion object {
        private val logger = LoggerFactory.getLogger(DashboardService::class.java)
    }

    fun getDailyVisitorStats(): List<DailyVisitorStats> {
        val (duration, data) = measureTimeMillisWithReturn {
            val firstOffer = offerService.getFirstOffer() ?: return emptyList()
            val lastOffer = offerService.getLastOffer() ?: return emptyList()


            val from = firstOffer.start.toLocalDate()
            val to = lastOffer.start.toLocalDate()

            val days = ChronoUnit.DAYS.between(from, to)
            (0..days).mapNotNull { getDailyVisitorStats(from.plusDays(it)) }
        }
        logger.info("Get daily visitor stats created within $duration ms.")
        return data
    }

    private fun getDailyVisitorStats(date: LocalDate): DailyVisitorStats? {
        val offer = offerService.getOffer(date)
        if (offer.isEmpty()) return null

        val activeOffer = offer.filter { it.active }
        val offerAmount = offer.size
        val activeOfferAmount = activeOffer.size
        val totalSpace = activeOffer.sumOf { it.maxPersons }

        val bookings = bookingService.getBookings(offer).groupBy { it.status }.mapValues { it.value.sumOf { b -> b.size } }.toMutableMap()
        BookingStatus.entries.forEach { status -> if (!bookings.containsKey(status)) bookings[status] = 0 }

        return DailyVisitorStats(date, offerAmount, activeOfferAmount, totalSpace, bookings)
    }


    fun getWeeksSummary(): List<WeekSummary> {
        val (duration, data) = measureTimeMillisWithReturn {
            val firstOffer = offerService.getFirstOffer() ?: return emptyList()
            val lastOffer = offerService.getLastOffer() ?: return emptyList()

            val bookingSequence = PageableSequence() { bookingService.getAll(it) }
            val unconfirmedByOfferId = bookingSequence.filter { it.status == BookingStatus.UNCONFIRMED }.map { it.offerId to 1 }
                .groupBy { it.first }.mapValues { v -> v.value.sumOf { it.second } }

            val offerSequence = PageableSequence() { offerService.getAll(it) }
            val unconfirmedByDate = offerSequence.map { it.start.toLocalDate() to (unconfirmedByOfferId[it.id] ?: 0) }.toMap()

            val from = firstOffer.start.toLocalDate()
            val to = lastOffer.start.toLocalDate()

            getWeeksBetween(from, to).mapIndexedNotNull { weekNumber, value -> getWeekSummary(weekNumber, value.first, value.second, unconfirmedByDate) }
        }
        logger.info("Weeks summary created within $duration ms.")
        return data
    }

    private fun getWeekSummary(weekIndex: Int, weekStart: LocalDate, weekEnd: LocalDate, unconfirmedByDate: Map<LocalDate, Int>): WeekSummary? {
        val days = ChronoUnit.DAYS.between(weekStart, weekEnd)
        val daySummary = (0..days).map { weekStart.plusDays(it) }
            .mapNotNull {
                val data = unconfirmedByDate[it] ?: 0
                DaySummary(it, data)
            }
        return WeekSummary(
            weekIndex + 1,
            weekStart,
            weekEnd,
            daySummary.sumOf { it.unconfirmedCount },
            daySummary
        )
    }

    private fun getWeeksBetween(from: LocalDate, to: LocalDate): List<Pair<LocalDate, LocalDate>> {
        val firstWeekStart = from.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY))
        val lastWeekStart = to.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY))
        if (firstWeekStart > lastWeekStart) throw IllegalArgumentException("Invalid date range specified")

        return generateSequence(firstWeekStart) { date ->
            date.plusWeeks(1).takeIf { it <= lastWeekStart }
        }.map { weekStart ->
            val weekEnd = weekStart.plusDays(6)
            weekStart to weekEnd
        }.toList()
    }

}
