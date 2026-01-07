package de.sambalmueslie.openbooking.core.reservation.api

import de.sambalmueslie.openbooking.core.offer.api.Assignment
import de.sambalmueslie.openbooking.core.offer.api.Offer

data class ReservationOffer(
    val offer: Offer,
    val assignment: Assignment,
)