package de.sambalmueslie.openbooking.core.offer.api

import de.sambalmueslie.openbooking.core.guide.api.Guide
import de.sambalmueslie.openbooking.core.label.api.Label

data class OfferInfo(
    val offer: Offer,
    val label: Label?,
    val guide: Guide?
)

