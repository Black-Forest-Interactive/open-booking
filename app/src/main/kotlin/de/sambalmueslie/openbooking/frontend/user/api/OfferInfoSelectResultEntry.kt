package de.sambalmueslie.openbooking.frontend.user.api

import de.sambalmueslie.openbooking.backend.info.api.DayInfoOffer
import java.time.LocalDate

data class OfferInfoSelectResultEntry(
    val date: LocalDate,
    val infos: List<DayInfoOffer>
)
