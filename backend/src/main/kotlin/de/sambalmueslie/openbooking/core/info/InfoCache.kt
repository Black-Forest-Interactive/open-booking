package de.sambalmueslie.openbooking.core.info


import com.github.benmanes.caffeine.cache.Caffeine
import com.github.benmanes.caffeine.cache.LoadingCache
import de.sambalmueslie.openbooking.common.measureTimeMillisWithReturn
import de.sambalmueslie.openbooking.core.booking.BookingService
import de.sambalmueslie.openbooking.core.booking.api.Booking
import de.sambalmueslie.openbooking.core.booking.api.BookingStatus
import de.sambalmueslie.openbooking.core.info.api.DayInfo
import de.sambalmueslie.openbooking.core.info.api.DayInfoBooking
import de.sambalmueslie.openbooking.core.info.api.DayInfoOffer
import de.sambalmueslie.openbooking.core.offer.OfferService
import de.sambalmueslie.openbooking.core.offer.api.Offer
import de.sambalmueslie.openbooking.infrastructure.cache.CacheService
import jakarta.inject.Singleton
import org.slf4j.LoggerFactory
import java.time.LocalDate
import java.util.concurrent.TimeUnit

@Singleton
class InfoCache(
    private val offerService: OfferService,
    private val bookingService: BookingService,
    cacheService: CacheService
) {

    companion object {
        private val logger = LoggerFactory.getLogger(InfoCache::class.java)
    }


    private val cache: LoadingCache<LocalDate, DayInfo?> = cacheService.register(DayInfo::class) {
        Caffeine.newBuilder()
            .maximumSize(100)
            .expireAfterWrite(1, TimeUnit.HOURS)
            .refreshAfterWrite(15, TimeUnit.MINUTES)
            .build { date -> createDayInfo(date) }
    }

    private fun createDayInfo(date: LocalDate): DayInfo? {
        val (duration, data) = measureTimeMillisWithReturn {
            val offer = offerService.getOffer(date)
            if (offer.isEmpty()) return null

            val first = offer.first()
            val last = offer.last()

            val bookingsByOffer = bookingService.getBookings(offer).groupBy { it.offerId }
            val offerInfo = offer.map { createOfferInfo(it, bookingsByOffer) }

            DayInfo(date, first.start, last.finish, offerInfo)
        }
        logger.info("Cache refresh for $date done within $duration ms.")
        return data
    }

    private fun createOfferInfo(offer: Offer, bookingsByOffer: Map<Long, List<Booking>>): DayInfoOffer {
        val bookings = bookingsByOffer[offer.id] ?: emptyList()

        val bookingInfo = bookings.map { DayInfoBooking(it.size, it.status) }

        val bookingSpace = bookingInfo.groupBy { it.status }.mapValues { it.value.sumOf { b -> b.size } }.toMutableMap()
        BookingStatus.entries.forEach { status -> if (!bookingSpace.containsKey(status)) bookingSpace[status] = 0 }

        return DayInfoOffer(offer, bookingSpace, bookingInfo)
    }

    operator fun get(date: LocalDate): DayInfo? {
        return cache.get(date)
    }

    fun refresh(date: LocalDate) {
        cache.refresh(date)
    }

}
