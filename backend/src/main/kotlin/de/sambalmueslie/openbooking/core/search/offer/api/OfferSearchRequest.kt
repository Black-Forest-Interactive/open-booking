package de.sambalmueslie.openbooking.core.search.offer.api

import de.sambalmueslie.openbooking.core.search.common.SearchRequest
import java.time.LocalDateTime

data class OfferSearchRequest(
    val fullTextSearch: String,
    val from: LocalDateTime?,
    val to: LocalDateTime?,
) : SearchRequest
