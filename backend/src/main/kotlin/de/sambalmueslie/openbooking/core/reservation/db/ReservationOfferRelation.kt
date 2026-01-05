package de.sambalmueslie.openbooking.core.reservation.db

import jakarta.persistence.Column
import jakarta.persistence.EmbeddedId
import jakarta.persistence.Entity
import jakarta.persistence.Table

@Entity(name = "ReservationOfferRelation")
@Table(name = "reservation_offer_relation")
data class ReservationOfferRelation(
    @EmbeddedId var id: ReservationOfferId,
    @Column var priority: Int,
) {
    companion object {
        fun create(reservation: ReservationData, offerId: Long, priority: Int) = ReservationOfferRelation(ReservationOfferId(reservation.id, offerId), priority)
    }
}
