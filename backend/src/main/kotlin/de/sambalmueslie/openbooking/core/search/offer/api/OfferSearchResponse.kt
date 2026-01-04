package de.sambalmueslie.openbooking.core.search.offer.api

import de.sambalmueslie.openbooking.core.search.common.SearchResponse
import io.micronaut.data.model.Page

data class OfferSearchResponse(
    override val result: Page<OfferSearchEntry>
) : SearchResponse<OfferSearchEntry>
