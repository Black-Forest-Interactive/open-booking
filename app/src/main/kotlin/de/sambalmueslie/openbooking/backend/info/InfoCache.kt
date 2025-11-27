package de.sambalmueslie.openbooking.backend.info


import com.github.benmanes.caffeine.cache.Caffeine
import com.github.benmanes.caffeine.cache.LoadingCache
import de.sambalmueslie.openbooking.backend.booking.BookingService
import de.sambalmueslie.openbooking.backend.booking.api.Booking
import de.sambalmueslie.openbooking.backend.booking.api.BookingStatus
import de.sambalmueslie.openbooking.backend.cache.CacheService
import de.sambalmueslie.openbooking.backend.info.api.DayInfo
import de.sambalmueslie.openbooking.backend.info.api.DayInfoBooking
import de.sambalmueslie.openbooking.backend.info.api.DayInfoOffer
import de.sambalmueslie.openbooking.backend.offer.OfferService
import de.sambalmueslie.openbooking.backend.offer.api.Offer
import de.sambalmueslie.openbooking.common.measureTimeMillisWithReturn
import jakarta.inject.Singleton
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import java.time.LocalDate
import java.util.concurrent.TimeUnit

@Singleton
class InfoCache(
    private val offerService: OfferService,
    private val bookingService: BookingService,
//    private val redis: StatefulRedisConnection<String, String>,
//    private val mapper: ObjectMapper,
    cacheService: CacheService
) {

    companion object {
        private val logger: Logger = LoggerFactory.getLogger(InfoCache::class.java)
    }


    private val cache: LoadingCache<LocalDate, DayInfo> = cacheService.register(DayInfo::class) {
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
        BookingStatus.values().forEach { status -> if (!bookingSpace.containsKey(status)) bookingSpace[status] = 0 }

        return DayInfoOffer(offer, bookingSpace, bookingInfo)
    }

    operator fun get(date: LocalDate): DayInfo? {
//        val command = redis.sync()
//        val key = date.format(DateTimeFormatter.ISO_DATE)
//        val current = command.get(key)
//        return if (current == null) {
//            refresh(date)
//        } else {
//            mapper.readValue(current)
//        }
        return cache.get(date)
    }

    fun refresh(date: LocalDate) {
        cache.refresh(date)
//        val info = createDayInfo(date) ?: return null
//
//        val key = date.format(DateTimeFormatter.ISO_DATE)
//        val value = mapper.writeValueAsString(info)
//
//        val command = redis.sync()
//        command.set(key, value)
//        return info
    }

}
