package de.sambalmueslie.openbooking.core.offer.feature

import de.sambalmueslie.openbooking.common.GenericRequestResult
import de.sambalmueslie.openbooking.common.PageSequence
import de.sambalmueslie.openbooking.common.TimeProvider
import de.sambalmueslie.openbooking.core.offer.OfferService
import de.sambalmueslie.openbooking.core.offer.api.OfferChangeDurationRequest
import de.sambalmueslie.openbooking.core.offer.db.OfferRepository
import jakarta.inject.Singleton
import org.slf4j.LoggerFactory
import java.time.LocalDateTime

@Singleton
class OfferChangeDurationFeature(
    private val repository: OfferRepository,
    private val service: OfferService,
    private val timeProvider: TimeProvider
) {
    companion object {
        private val logger = LoggerFactory.getLogger(OfferChangeDurationFeature::class.java)
        private const val MSG_FAIL = "REQUEST.OFFER.CHANGE_DURATION.FAIL"
        private const val MSG_SUCCESS = "REQUEST.OFFER.CHANGE_DURATION.SUCCESS"
    }

    fun process(request: OfferChangeDurationRequest): GenericRequestResult {
        if (!request.duration.isPositive) return GenericRequestResult(false, MSG_FAIL)
        if (request.timeTo.isBefore(request.timeFrom)) return GenericRequestResult(false, MSG_FAIL)
        if (request.dateTo.isBefore(request.dateFrom)) return GenericRequestResult(false, MSG_FAIL)
        if (request.timeTo.isBefore(request.timeFrom)) return GenericRequestResult(false, MSG_FAIL)
        val timestamp = timeProvider.now()

        generateSequence(request.dateFrom) { it.plusDays(1).takeIf { date -> date <= request.dateTo } }
            .forEach { date ->
                val startDateTime = LocalDateTime.of(date, request.timeFrom)
                val endDateTime = LocalDateTime.of(date, request.timeTo)
                logger.info("Update $date in range $startDateTime to $endDateTime")

                val pageSequence = PageSequence(500) { repository.findByStartGreaterThanEqualsAndStartLessThanEquals(startDateTime, endDateTime, it) }
                pageSequence.forEach { page ->
                    logger.info("Update page ${page.pageNumber} with ${page.content.size} elements")
                    val data = page.content.map {
                        val finish = it.start.plus(request.duration)
                        logger.info("Update offer ${it.id} set finish from ${it.finish} to $finish")
                        it.updateFinish(finish, timestamp)
                    }
                    if (data.isNotEmpty()) service.updateBlock(data)
                }
            }

        return GenericRequestResult(true, MSG_SUCCESS)
    }

}