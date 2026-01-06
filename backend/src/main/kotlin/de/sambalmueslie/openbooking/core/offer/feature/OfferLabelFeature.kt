package de.sambalmueslie.openbooking.core.offer.feature

import de.sambalmueslie.openbooking.common.GenericRequestResult
import de.sambalmueslie.openbooking.common.PageableSequence
import de.sambalmueslie.openbooking.common.TimeProvider
import de.sambalmueslie.openbooking.core.label.LabelService
import de.sambalmueslie.openbooking.core.offer.OfferService
import de.sambalmueslie.openbooking.core.offer.db.OfferRepository
import jakarta.inject.Singleton
import org.slf4j.LoggerFactory
import java.time.LocalDate
import kotlin.system.measureTimeMillis

@Singleton
class OfferLabelFeature(
    private val repository: OfferRepository,
    private val service: OfferService,
    private val labelService: LabelService,
    private val timeProvider: TimeProvider,
) {
    companion object {
        private val logger = LoggerFactory.getLogger(OfferLabelFeature::class.java)
        private const val MSG_FAIL = "REQUEST.OFFER.LABEL.FAIL"
        private const val MSG_SUCCESS = "REQUEST.OFFER.LABEL.SUCCESS"
    }

    fun process(day: LocalDate): GenericRequestResult {
        val duration = measureTimeMillis {
            logger.debug("[{}] update labels", day)
            val labelIterator = labelService.getLabelIterator()
            val from = day.atStartOfDay()
            val to = day.atStartOfDay().plusDays(1)
            val offerSequence = PageableSequence() { repository.findAllByStartGreaterThanEqualsAndFinishLessThanOrderByStart(from, to, it) }

            offerSequence.forEach { offer ->
                val label = labelIterator.next()
                if (offer.labelId == label?.id) return@forEach

                service.patch(offer) {
                    it.updateLabel(label, timeProvider.now())
                }
            }
        }
        logger.info("[{}] finished within {} ms", day, duration)
        return GenericRequestResult(true, MSG_SUCCESS)
    }
}