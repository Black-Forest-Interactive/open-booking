package de.sambalmueslie.openbooking.core.search.offer.api

import java.time.LocalDate

data class OfferGroupedSearchResult(
    val day: LocalDate,
    val entries: List<OfferSearchEntry>
)
