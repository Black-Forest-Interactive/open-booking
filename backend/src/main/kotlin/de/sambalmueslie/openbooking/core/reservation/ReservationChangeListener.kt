package de.sambalmueslie.openbooking.core.reservation

import de.sambalmueslie.openbooking.common.BusinessObjectChangeListener
import de.sambalmueslie.openbooking.core.reservation.api.Reservation
import de.sambalmueslie.openbooking.core.reservation.api.ReservationConfirmationContent

interface ReservationChangeListener : BusinessObjectChangeListener<Long, Reservation> {
    fun confirmed(reservation: Reservation, content: ReservationConfirmationContent) {
        // intentionally left empty
    }

    fun denied(reservation: Reservation, content: ReservationConfirmationContent) {
        // intentionally left empty
    }
}