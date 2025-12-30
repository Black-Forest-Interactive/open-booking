package de.sambalmueslie.openbooking.gateway.portal.offer

import de.sambalmueslie.openbooking.core.info.api.DayInfoOffer
import java.time.LocalDate

data class OfferInfoSelectResultEntry(
    val date: LocalDate,
    val infos: List<DayInfoOffer>
)