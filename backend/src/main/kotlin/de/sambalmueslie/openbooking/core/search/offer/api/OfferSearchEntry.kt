package de.sambalmueslie.openbooking.core.search.offer.api

import de.sambalmueslie.openbooking.core.offer.api.Offer

data class OfferSearchEntry(
    val offer: Offer,
    val reservations: List<OfferReservationEntry>,
    val bookings: List<OfferBookingEntry>
)
