package de.sambalmueslie.openbooking.core.info.api


import de.sambalmueslie.openbooking.core.booking.api.BookingStatus
import de.sambalmueslie.openbooking.core.offer.api.Offer


data class DayInfoOffer(
    val offer: Offer,
    val space: Map<BookingStatus, Int>,
    val bookings: List<DayInfoBooking>
)
