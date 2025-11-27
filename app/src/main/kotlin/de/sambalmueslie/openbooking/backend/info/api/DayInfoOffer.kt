package de.sambalmueslie.openbooking.backend.info.api


import de.sambalmueslie.openbooking.backend.booking.api.BookingStatus
import de.sambalmueslie.openbooking.backend.offer.api.Offer


data class DayInfoOffer(
    val offer: Offer,
    val space: Map<BookingStatus, Int>,
    val bookings: List<DayInfoBooking>
)
