package de.sambalmueslie.openbooking.core.reservation.db

import jakarta.persistence.Column
import jakarta.persistence.Embeddable

@Embeddable
data class ReservationOfferId(
    @Column(name = "reservation_id") var reservationId: Long,
    @Column(name = "offer_id") var offerId: Long
)