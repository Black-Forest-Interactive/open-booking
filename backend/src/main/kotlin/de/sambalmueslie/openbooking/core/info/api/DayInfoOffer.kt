package de.sambalmueslie.openbooking.core.info.api


import de.sambalmueslie.openbooking.core.offer.api.Assignment
import de.sambalmueslie.openbooking.core.offer.api.Offer


data class DayInfoOffer(
    val offer: Offer,
    val assignment: Assignment,
    val bookings: List<DayInfoBooking>
)
