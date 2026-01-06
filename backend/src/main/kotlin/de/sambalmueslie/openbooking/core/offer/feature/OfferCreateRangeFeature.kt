package de.sambalmueslie.openbooking.core.offer.feature

import de.sambalmueslie.openbooking.common.GenericRequestResult
import de.sambalmueslie.openbooking.core.label.LabelService
import de.sambalmueslie.openbooking.core.offer.OfferService
import de.sambalmueslie.openbooking.core.offer.api.OfferChangeRequest
import de.sambalmueslie.openbooking.core.offer.api.OfferRangeRequest
import jakarta.inject.Singleton
import org.slf4j.LoggerFactory
import java.time.LocalDateTime
import java.time.temporal.ChronoUnit

@Singleton
class OfferCreateRangeFeature(
    private val service: OfferService,
    private val labelService: LabelService
) {
    companion object {
        private val logger = LoggerFactory.getLogger(OfferCreateRangeFeature::class.java)
        private const val MSG_FAIL = "REQUEST.OFFER.RANGE.FAIL"
        private const val MSG_SUCCESS = "REQUEST.OFFER.RANGE.SUCCESS"
    }

    fun process(request: OfferRangeRequest): GenericRequestResult {
        if (!request.duration.isPositive) return GenericRequestResult(false, MSG_FAIL)
        if (!request.interval.isPositive) return GenericRequestResult(false, MSG_FAIL)
        if (request.dateTo.isBefore(request.dateFrom)) return GenericRequestResult(false, MSG_FAIL)
        if (request.timeTo.isBefore(request.timeFrom)) return GenericRequestResult(false, MSG_FAIL)

        var date = request.dateFrom
        val days = ChronoUnit.DAYS.between(request.dateFrom, request.dateTo)
        val labels = labelService.getLabelIterator()

        (0..days).forEach {
            var startTime = request.timeFrom
            var finishTime = startTime.plus(request.duration)

            val createRequests = mutableListOf<OfferChangeRequest>()

            while (!finishTime.isAfter(request.timeTo)) {
                val start = LocalDateTime.of(date, startTime)
                val finish = LocalDateTime.of(date, finishTime)
                createRequests.add(OfferChangeRequest(start, finish, request.maxPersons, true, labels.next()?.id, null))

                startTime = startTime.plus(request.interval)
                finishTime = startTime.plus(request.duration)
            }

            service.create(createRequests)

            date = date.plusDays(1)
        }

        return GenericRequestResult(true, MSG_SUCCESS)
    }

}