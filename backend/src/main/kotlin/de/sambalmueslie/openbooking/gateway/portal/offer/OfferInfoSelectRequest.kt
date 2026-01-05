package de.sambalmueslie.openbooking.gateway.portal.offer

import java.time.LocalDate

data class OfferInfoSelectRequest(
    val groupSize: Int, val dates: List<LocalDate>
)