package de.sambalmueslie.openbooking.backend.offer.api

import java.time.LocalDate

data class OfferFilterRequest(
    val from: LocalDate?,
    val to: LocalDate?,
    val active: Boolean?
)
