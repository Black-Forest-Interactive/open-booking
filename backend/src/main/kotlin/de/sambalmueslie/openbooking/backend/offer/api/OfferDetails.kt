package de.sambalmueslie.openbooking.backend.offer.api

import de.sambalmueslie.openbooking.backend.request.api.BookingRequestInfo

data class OfferDetails(
    val offer: Offer,
    val bookings: List<BookingRequestInfo>
)
