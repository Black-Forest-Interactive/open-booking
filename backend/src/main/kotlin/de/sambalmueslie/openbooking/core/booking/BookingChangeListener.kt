package de.sambalmueslie.openbooking.core.booking

import de.sambalmueslie.openbooking.common.EntityChangeListener
import de.sambalmueslie.openbooking.core.booking.api.Booking
import de.sambalmueslie.openbooking.core.booking.api.BookingConfirmationContent

interface BookingChangeListener : EntityChangeListener<Long, Booking> {
    fun confirmed(booking: Booking, content: BookingConfirmationContent) {
        // intentionally left empty
    }

    fun denied(booking: Booking, content: BookingConfirmationContent) {
        // intentionally left empty
    }
}