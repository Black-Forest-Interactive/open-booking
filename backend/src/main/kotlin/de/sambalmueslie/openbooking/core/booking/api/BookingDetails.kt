package de.sambalmueslie.openbooking.core.booking.api

import de.sambalmueslie.openbooking.core.group.api.VisitorGroup

data class BookingDetails(
    val booking: Booking,
    val visitorGroup: VisitorGroup
)
