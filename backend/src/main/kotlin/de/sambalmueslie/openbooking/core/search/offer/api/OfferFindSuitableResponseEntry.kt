package de.sambalmueslie.openbooking.core.search.offer.api

import de.sambalmueslie.openbooking.core.offer.api.OfferReference
import java.time.LocalDate

data class OfferFindSuitableResponseEntry(
    val day: LocalDate,
    val entries: List<OfferReference>
)
