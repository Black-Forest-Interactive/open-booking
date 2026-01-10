package de.sambalmueslie.openbooking.core.info.api


import de.sambalmueslie.openbooking.core.offer.api.Assignment
import de.sambalmueslie.openbooking.core.offer.api.Offer
import java.time.LocalDateTime


data class DayInfoOffer(
    val offer: Offer,
    val assignment: Assignment,
    val claimedUntil: LocalDateTime?,
    val bookings: List<DayInfoBooking>
)
