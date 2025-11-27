package de.sambalmueslie.openbooking.backend.booking.api

import de.sambalmueslie.openbooking.backend.group.api.VisitorGroup

data class BookingDetails(
    val booking: Booking,
    val visitorGroup: VisitorGroup
)
