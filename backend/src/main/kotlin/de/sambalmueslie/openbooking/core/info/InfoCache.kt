package de.sambalmueslie.openbooking.core.info


import com.github.benmanes.caffeine.cache.Caffeine
import com.github.benmanes.caffeine.cache.LoadingCache
import de.sambalmueslie.openbooking.common.measureTimeMillisWithReturn
import de.sambalmueslie.openbooking.core.info.api.DayInfo
import de.sambalmueslie.openbooking.core.info.api.DayInfoBooking
import de.sambalmueslie.openbooking.core.info.api.DayInfoOffer
import de.sambalmueslie.openbooking.core.offer.assembler.OfferDetailsAssembler
import de.sambalmueslie.openbooking.infrastructure.cache.CacheService
import jakarta.inject.Singleton
import org.slf4j.LoggerFactory
import java.time.LocalDate
import java.util.concurrent.TimeUnit

@Singleton
class InfoCache(
    private val offerDetailsAssembler: OfferDetailsAssembler,
    cacheService: CacheService
) {

    companion object {
        private val logger = LoggerFactory.getLogger(InfoCache::class.java)
    }

    private val cache: LoadingCache<LocalDate, DayInfo?> = cacheService.register(DayInfo::class) {
        Caffeine.newBuilder().maximumSize(100).expireAfterWrite(1, TimeUnit.HOURS).refreshAfterWrite(15, TimeUnit.MINUTES).build { date -> createDayInfo(date) }
    }

    private fun createDayInfo(date: LocalDate): DayInfo? {
        val (duration, data) = measureTimeMillisWithReturn {
            val details = offerDetailsAssembler.getByDate(date)
            if (details.isEmpty()) return null

            val first = details.first()
            val last = details.last()

            val offer = details.map {
                DayInfoOffer(it.offer, it.assignment, it.bookings.map { b -> DayInfoBooking(b.booking.size, b.booking.status) })
            }
            DayInfo(date, first.offer.start, last.offer.finish, offer)
        }
        logger.info("Cache refresh for $date done within $duration ms.")
        return data
    }

    operator fun get(date: LocalDate): DayInfo? {
        return cache.get(date)
    }

    fun refresh(date: LocalDate) {
        cache.refresh(date)
    }

}
