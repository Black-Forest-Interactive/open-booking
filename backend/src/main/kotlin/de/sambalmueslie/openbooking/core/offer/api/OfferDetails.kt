package de.sambalmueslie.openbooking.core.offer.api

import de.sambalmueslie.openbooking.core.request.api.BookingRequestInfo

data class OfferDetails(
    val offer: Offer,
    val bookings: List<BookingRequestInfo>
)
