package de.sambalmueslie.openbooking.core.search.reservation.db

import kotlinx.serialization.Serializable

@Serializable
data class ReservationOfferEntryData(
    var offerId: Long,
    var priority: Int
)