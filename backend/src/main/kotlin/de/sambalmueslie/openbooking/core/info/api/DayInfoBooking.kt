package de.sambalmueslie.openbooking.core.info.api

import de.sambalmueslie.openbooking.core.booking.api.BookingStatus

data class DayInfoBooking(
    val size: Int,
    val status: BookingStatus,
)
