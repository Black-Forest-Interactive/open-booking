package de.sambalmueslie.openbooking.frontend.user.api

import java.time.LocalDate

data class OfferInfoSelectRequest(
    val groupSize: Int,
    val dates: List<LocalDate>
)
