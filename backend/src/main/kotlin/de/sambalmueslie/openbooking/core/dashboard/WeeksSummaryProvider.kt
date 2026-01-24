package de.sambalmueslie.openbooking.core.dashboard


import de.sambalmueslie.openbooking.common.TimeProvider
import de.sambalmueslie.openbooking.core.dashboard.api.WeekSummary
import de.sambalmueslie.openbooking.core.offer.OfferService
import jakarta.inject.Singleton
import org.slf4j.LoggerFactory
import java.time.DayOfWeek
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.temporal.TemporalAdjusters

@Singleton
class WeeksSummaryProvider(
    private val offerService: OfferService,
    private val timeProvider: TimeProvider
) {
    companion object {
        private val logger = LoggerFactory.getLogger(WeeksSummaryProvider::class.java)
    }

    fun getWeeksSummary(): List<WeekSummary> {
        val firstOffer = offerService.getFirstOffer() ?: return emptyList()
        val lastOffer = offerService.getLastOffer() ?: return emptyList()

        val timestamp = timeProvider.now()
        val from = firstOffer.start.toLocalDate()
        val to = lastOffer.start.toLocalDate()

        return getWeeksBetween(from, to)
            .mapIndexed { weekNumber, value -> getWeekSummary(weekNumber, value.first, value.second, timestamp) }
    }

    private fun getWeekSummary(weekIndex: Int, weekStart: LocalDate, weekEnd: LocalDate, timestamp: LocalDateTime): WeekSummary {
        return WeekSummary(
            weekIndex + 1,
            weekStart,
            weekEnd,
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