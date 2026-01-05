package de.sambalmueslie.openbooking.core.dashboard


import de.sambalmueslie.openbooking.common.PageableSequence
import de.sambalmueslie.openbooking.core.dashboard.api.DaySummary
import de.sambalmueslie.openbooking.core.dashboard.api.WeekSummary
import de.sambalmueslie.openbooking.core.offer.OfferService
import de.sambalmueslie.openbooking.core.reservation.api.ReservationStatus
import de.sambalmueslie.openbooking.core.search.reservation.ReservationSearchOperator
import de.sambalmueslie.openbooking.core.search.reservation.api.ReservationSearchRequest
import jakarta.inject.Singleton
import org.slf4j.LoggerFactory
import java.time.DayOfWeek
import java.time.LocalDate
import java.time.temporal.ChronoUnit
import java.time.temporal.TemporalAdjusters

@Singleton
class WeeksSummaryProvider(
    private val offerService: OfferService,
    private val searchService: ReservationSearchOperator
) {
    companion object {
        private val logger = LoggerFactory.getLogger(WeeksSummaryProvider::class.java)
    }

    fun getWeeksSummary(): List<WeekSummary> {
        val firstOffer = offerService.getFirstOffer() ?: return emptyList()
        val lastOffer = offerService.getLastOffer() ?: return emptyList()

        val reservationRequest = ReservationSearchRequest("", listOf(ReservationStatus.UNCONFIRMED), null, null)
        val reservationSequence = PageableSequence() { searchService.search(reservationRequest, it).result }
        val unconfirmedByOfferId = mutableMapOf<Long, Int>()
        reservationSequence.forEach {
            it.offers.forEach { o ->
                val current = unconfirmedByOfferId.getOrPut(o.offer.id) { 0 }
                unconfirmedByOfferId[o.offer.id] = current + 1
            }
        }

        val offerSequence = PageableSequence() { offerService.getAll(it) }
        val unconfirmedByDate = offerSequence.map { it.start.toLocalDate() to (unconfirmedByOfferId[it.id] ?: 0) }
            .groupBy { it.first }
            .mapValues { it.value.sumOf { v -> v.second } }

        val from = firstOffer.start.toLocalDate()
        val to = lastOffer.start.toLocalDate()

        return getWeeksBetween(from, to).mapIndexedNotNull { weekNumber, value -> getWeekSummary(weekNumber, value.first, value.second, unconfirmedByDate) }
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