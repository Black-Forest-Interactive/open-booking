package de.sambalmueslie.openbooking.core.offer

import de.sambalmueslie.openbooking.common.GenericRequestResult
import de.sambalmueslie.openbooking.core.offer.api.OfferRedistributeRequest
import de.sambalmueslie.openbooking.core.offer.feature.OfferLabelFeature
import de.sambalmueslie.openbooking.core.offer.feature.OfferRedistributeFeature
import jakarta.inject.Singleton
import java.time.LocalDate

@Singleton
class OfferOperator(
    private val redistributeFeature: OfferRedistributeFeature,
    private val labelFeature: OfferLabelFeature,
) {

    fun redistribute(request: OfferRedistributeRequest): GenericRequestResult {
        val result = redistributeFeature.process(request)
        if (result.success) {
            labelFeature.process(request.date)
        }
        return result
    }

    fun relabel(date: LocalDate): GenericRequestResult {
        return labelFeature.process(date)
    }
}