package de.sambalmueslie.openbooking.core.offer.api

import java.time.LocalDateTime

data class OfferClaim(
    val offerId: Long,
    val userId: String,
    val expires: LocalDateTime
)
