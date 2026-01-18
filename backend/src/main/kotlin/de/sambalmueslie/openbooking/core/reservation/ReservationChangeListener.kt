package de.sambalmueslie.openbooking.core.reservation

import de.sambalmueslie.openbooking.common.EntityChangeListener
import de.sambalmueslie.openbooking.core.reservation.api.Reservation
import de.sambalmueslie.openbooking.core.reservation.api.ReservationConfirmationContent

interface ReservationChangeListener : EntityChangeListener<Long, Reservation> {
    fun confirmed(reservation: Reservation, content: ReservationConfirmationContent) {
        // intentionally left empty
    }

    fun denied(reservation: Reservation, content: ReservationConfirmationContent) {
        // intentionally left empty
    }
}