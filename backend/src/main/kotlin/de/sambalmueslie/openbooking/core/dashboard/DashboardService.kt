package de.sambalmueslie.openbooking.core.dashboard


import de.sambalmueslie.openbooking.common.measureTimeMillisWithReturn
import de.sambalmueslie.openbooking.core.booking.BookingService
import de.sambalmueslie.openbooking.core.booking.api.BookingStatus
import de.sambalmueslie.openbooking.core.dashboard.api.DailyVisitorStats
import de.sambalmueslie.openbooking.core.dashboard.api.OfferEntry
import de.sambalmueslie.openbooking.core.dashboard.api.WeekSummary
import de.sambalmueslie.openbooking.core.offer.OfferService
import de.sambalmueslie.openbooking.gateway.admin.dashboard.DailyOffersFilterRequest
import jakarta.inject.Singleton
import org.slf4j.LoggerFactory
import java.time.LocalDate
import java.time.temporal.ChronoUnit

@Singleton
class DashboardService(
    private val offerService: OfferService,
    private val bookingService: BookingService,
    private val weeksSummaryProvider: WeeksSummaryProvider,
    private val offerEntryProvider: OfferEntryProvider
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
            weeksSummaryProvider.getWeeksSummary()
        }
        logger.info("Weeks summary created within $duration ms.")
        return data
    }

    fun getDailyOffers(day: LocalDate, request: DailyOffersFilterRequest?): List<OfferEntry> {
        val (duration, data) = measureTimeMillisWithReturn {
            offerEntryProvider.getDailyOffers(day, request)
        }
        logger.info("Daily offers created within $duration ms.")
        return data
    }

}
