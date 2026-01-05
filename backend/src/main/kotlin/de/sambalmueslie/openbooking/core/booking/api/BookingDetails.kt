package de.sambalmueslie.openbooking.core.booking.api

import de.sambalmueslie.openbooking.core.visitor.api.Visitor

data class BookingDetails(
    val booking: Booking,
    val visitor: Visitor
)
