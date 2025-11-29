package de.sambalmueslie.openbooking.backend.dashboard


import de.sambalmueslie.openbooking.backend.booking.BookingService
import de.sambalmueslie.openbooking.backend.booking.api.BookingStatus
import de.sambalmueslie.openbooking.backend.dashboard.api.DailyVisitorStats
import de.sambalmueslie.openbooking.backend.offer.OfferService
import de.sambalmueslie.openbooking.common.measureTimeMillisWithReturn
import jakarta.inject.Singleton
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import java.time.LocalDate
import java.time.temporal.ChronoUnit

@Singleton
class DashboardService(
    private val offerService: OfferService,
    private val bookingService: BookingService
) {

    companion object {
        private val logger: Logger = LoggerFactory.getLogger(DashboardService::class.java)
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
        BookingStatus.values().forEach { status -> if (!bookings.containsKey(status)) bookings[status] = 0 }

        return DailyVisitorStats(date, offerAmount, activeOfferAmount, totalSpace, bookings)
    }
}
