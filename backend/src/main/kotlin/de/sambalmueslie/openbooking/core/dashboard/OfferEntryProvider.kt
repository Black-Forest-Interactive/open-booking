package de.sambalmueslie.openbooking.core.dashboard

import de.sambalmueslie.openbooking.core.search.offer.OfferSearchOperator
import de.sambalmueslie.openbooking.core.search.offer.api.OfferSearchEntry
import de.sambalmueslie.openbooking.core.search.offer.api.OfferSearchRequest
import io.micronaut.data.model.Pageable
import jakarta.inject.Singleton

@Singleton
class OfferEntryProvider(
    private val searchService: OfferSearchOperator,
) {

    fun getDailyOffers(request: OfferSearchRequest): List<OfferSearchEntry> {
        val response = searchService.search(request, Pageable.from(0, 1000))
        return response.result.content
    }
}