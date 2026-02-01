package de.sambalmueslie.openbooking.core.booking

import de.sambalmueslie.openbooking.common.EntityChangeListener
import de.sambalmueslie.openbooking.core.booking.api.Booking
import de.sambalmueslie.openbooking.core.booking.api.BookingChangeRequest
import de.sambalmueslie.openbooking.core.booking.api.BookingConfirmationContent

interface BookingChangeListener : EntityChangeListener<Long, Booking, BookingChangeRequest> {
    fun confirmed(booking: Booking, content: BookingConfirmationContent) {
        // intentionally left empty
    }

    fun declined(booking: Booking, content: BookingConfirmationContent) {
        // intentionally left empty
    }

    fun canceled(booking: Booking) {
        // intentionally left empty
    }
}