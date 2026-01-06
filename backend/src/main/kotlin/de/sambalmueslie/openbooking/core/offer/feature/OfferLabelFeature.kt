package de.sambalmueslie.openbooking.core.offer.feature

import de.sambalmueslie.openbooking.common.GenericRequestResult
import de.sambalmueslie.openbooking.common.PageSequence
import de.sambalmueslie.openbooking.common.TimeProvider
import de.sambalmueslie.openbooking.core.label.LabelService
import de.sambalmueslie.openbooking.core.offer.OfferService
import de.sambalmueslie.openbooking.core.offer.db.OfferRepository
import jakarta.inject.Singleton
import org.slf4j.LoggerFactory
import java.time.LocalDate

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
        val labelIterator = labelService.getLabelIterator()
        val from = day.atStartOfDay()
        val to = day.atStartOfDay().plusDays(1)
        val offerSequence = PageSequence() { repository.findAllByStartGreaterThanEqualsAndFinishLessThanOrderByStart(from, to, it) }

        offerSequence.forEach { page ->
            val result = page.content.map { offer ->
                offer.updateLabel(labelIterator.next(), timeProvider.now())
            }
            service.update(result)
        }
        return GenericRequestResult(true, MSG_SUCCESS)
    }

}