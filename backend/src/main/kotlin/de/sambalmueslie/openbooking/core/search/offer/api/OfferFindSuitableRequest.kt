package de.sambalmueslie.openbooking.core.search.offer.api

import java.time.LocalDateTime

data class OfferFindSuitableRequest(
    val from: LocalDateTime?,
    val to: LocalDateTime?,
    val visitorSize: Int
)
