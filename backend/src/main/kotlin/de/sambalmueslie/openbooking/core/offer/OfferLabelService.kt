package de.sambalmueslie.openbooking.core.offer

import de.sambalmueslie.openbooking.core.label.LabelService
import de.sambalmueslie.openbooking.core.label.api.Label
import de.sambalmueslie.openbooking.core.offer.db.OfferData
import de.sambalmueslie.openbooking.core.offer.db.OfferRepository
import jakarta.inject.Singleton
import org.slf4j.LoggerFactory

@Singleton
class OfferLabelService(
    private val repository: OfferRepository,
    private val labelService: LabelService,
) {
    companion object {
        private val logger = LoggerFactory.getLogger(OfferLabelService::class.java)
    }

    fun determineLabel(data: OfferData): Label? {
        val previousOffer = repository.findOneByStartLessThanEqualsOrderByStartDesc(data.start)
        val previousLabel = previousOffer?.labelId

        return labelService.getNext(previousLabel)
    }


}