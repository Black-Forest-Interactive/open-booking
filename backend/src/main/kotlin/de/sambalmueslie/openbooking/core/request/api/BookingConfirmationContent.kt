package de.sambalmueslie.openbooking.core.request.api

data class BookingConfirmationContent(
    val subject: String,
    val content: String,
    val silent: Boolean
)
