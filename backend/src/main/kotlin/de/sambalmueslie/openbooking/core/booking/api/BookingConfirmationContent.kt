package de.sambalmueslie.openbooking.core.booking.api

data class BookingConfirmationContent(
    val subject: String,
    val content: String,
    val silent: Boolean
)
