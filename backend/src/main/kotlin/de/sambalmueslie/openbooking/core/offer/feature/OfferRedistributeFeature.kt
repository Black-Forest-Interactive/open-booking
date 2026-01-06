package de.sambalmueslie.openbooking.core.offer.feature

import de.sambalmueslie.openbooking.common.GenericRequestResult
import de.sambalmueslie.openbooking.common.TimeProvider
import de.sambalmueslie.openbooking.core.offer.OfferService
import de.sambalmueslie.openbooking.core.offer.api.OfferChangeRequest
import de.sambalmueslie.openbooking.core.offer.api.OfferRedistributeRequest
import de.sambalmueslie.openbooking.core.offer.db.OfferRepository
import jakarta.inject.Singleton
import org.slf4j.LoggerFactory
import java.time.Duration
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.LocalTime
import kotlin.system.measureTimeMillis

@Singleton
class OfferRedistributeFeature(
    private val repository: OfferRepository,
    private val service: OfferService,
    private val timeProvider: TimeProvider
) {
    companion object {
        private val logger = LoggerFactory.getLogger(OfferRedistributeFeature::class.java)
        private const val MSG_FAIL = "REQUEST.OFFER.REDISTRIBUTE.FAIL"
        private const val MSG_SUCCESS = "REQUEST.OFFER.REDISTRIBUTE.SUCCESS"
    }

    fun process(request: OfferRedistributeRequest): GenericRequestResult {
        if (!request.duration.isPositive) return GenericRequestResult(false, MSG_FAIL)
        if (request.timeTo.isBefore(request.timeFrom)) return GenericRequestResult(false, MSG_FAIL)
        val duration = measureTimeMillis {
            val firstHour = request.timeFrom.withMinute(0).withSecond(0).withNano(0)
            val lastHour = request.timeTo.withMinute(0).withSecond(0).withNano(0)

            val hours: Sequence<LocalTime> = generateSequence(firstHour) { current ->
                val next = current.plusHours(1)
                if (next.isBefore(lastHour) || next == lastHour) next else null
            }.takeWhile { it.isBefore(lastHour) }

            hours.forEach { hour ->
                processHour(request.date, request.duration, hour)
            }
        }
        logger.info("[{}] Process redistribution done within {} ms", request.date, duration)
        return GenericRequestResult(true, MSG_SUCCESS)
    }

    private fun processHour(date: LocalDate, duration: Duration, hour: LocalTime) {
        logger.debug("[{} {}] Process hour with and duration {}", date, hour, duration)

        val from = LocalDateTime.of(date, hour)
        val to = LocalDateTime.of(date, hour.plusMinutes(59))
        logger.debug("[{} {}] search for offers between {} and {} ", date, hour, from, to)

        val offers = repository.findAllByStartGreaterThanEqualsAndFinishLessThanOrderByStart(from, to)
        logger.debug("[{} {}] found {} offers", date, hour, offers.size)
        if (offers.isEmpty()) return

        val newIntervalMinutes = (60 / offers.size + 1).toLong()
        logger.debug("[{} {}] apply new interval {} minutes ", date, hour, newIntervalMinutes)

        val firstOffer = offers.first()
        val newOfferStart = from.plusMinutes(newIntervalMinutes)
        service.create(OfferChangeRequest(newOfferStart, newOfferStart.plus(duration), firstOffer.maxPersons, true, null, null))

        offers.drop(1).forEachIndexed { index, data ->
            val expectedStart = from.plusMinutes((index + 1) * newIntervalMinutes)
            if (expectedStart == data.start) return@forEachIndexed

            val offset = Duration.between(data.start, expectedStart)
            val expectedFinish = data.finish.plus(offset)

            logger.debug("[{} {}] update offer from {} {} to {} {}", date, hour, data.start, expectedStart, data.finish, expectedFinish)
            service.patch(data) {
                it.update(expectedStart, expectedFinish, timeProvider.now())
            }
        }
    }
}