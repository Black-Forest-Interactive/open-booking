package de.sambalmueslie.openbooking.core.dashboard

import de.sambalmueslie.openbooking.core.search.offer.OfferSearchOperator
import de.sambalmueslie.openbooking.core.search.offer.api.OfferSearchEntry
import de.sambalmueslie.openbooking.core.search.offer.api.OfferSearchRequest
import de.sambalmueslie.openbooking.gateway.admin.dashboard.DailyOffersFilterRequest
import io.micronaut.data.model.Pageable
import jakarta.inject.Singleton
import java.time.LocalDate

@Singleton
class OfferEntryProvider(
    private val searchService: OfferSearchOperator,
) {

    fun getDailyOffers(day: LocalDate, request: DailyOffersFilterRequest?): List<OfferSearchEntry> {
        val fullTextSearch = request?.showName ?: ""
        val response = searchService.search(OfferSearchRequest(fullTextSearch, day.atStartOfDay(), day.atStartOfDay().plusDays(1)), Pageable.from(0, 1000))
        return response.result.content
    }
}