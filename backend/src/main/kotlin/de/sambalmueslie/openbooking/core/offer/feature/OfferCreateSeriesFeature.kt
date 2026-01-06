package de.sambalmueslie.openbooking.core.offer.feature

import de.sambalmueslie.openbooking.common.GenericRequestResult
import de.sambalmueslie.openbooking.core.label.LabelService
import de.sambalmueslie.openbooking.core.offer.OfferService
import de.sambalmueslie.openbooking.core.offer.api.OfferChangeRequest
import de.sambalmueslie.openbooking.core.offer.api.OfferSeriesRequest
import jakarta.inject.Singleton
import org.slf4j.LoggerFactory

@Singleton
class OfferCreateSeriesFeature(
    private val service: OfferService,
    private val labelService: LabelService
) {
    companion object {
        private val logger = LoggerFactory.getLogger(OfferCreateSeriesFeature::class.java)
        private const val MSG_FAIL = "REQUEST.OFFER.SERIES.FAIL"
        private const val MSG_SUCCESS = "REQUEST.OFFER.SERIES.SUCCESS"
    }


    fun process(request: OfferSeriesRequest): GenericRequestResult {
        if (!request.duration.isPositive) return GenericRequestResult(false, MSG_FAIL)
        if (!request.interval.isPositive) return GenericRequestResult(false, MSG_FAIL)
        if (request.quantity <= 0) return GenericRequestResult(false, MSG_FAIL)
        val labels = labelService.getLabelIterator()

        val createRequests = mutableListOf<OfferChangeRequest>()
        var start = request.start
        (0 until request.quantity).forEach { _ ->
            val finish = start.plus(request.duration)
            val finishTime = finish.toLocalTime()
            if (finishTime.isAfter(request.maxTime)) {
                start = start.with(request.minTime).plusDays(1)
                labels.reset()
                createRequests.add(OfferChangeRequest(start, start.plus(request.duration), request.maxPersons, true, labels.next()?.id, null))
            } else {
                createRequests.add(OfferChangeRequest(start, finish, request.maxPersons, true, labels.next()?.id, null))
            }

            start = start.plus(request.interval)
            val startTime = start.toLocalTime()
            if (startTime.isAfter(request.maxTime)) {
                start = start.with(request.minTime).plusDays(1)
            }
        }
        service.create(createRequests)
        return GenericRequestResult(true, MSG_SUCCESS)
    }
}