package de.sambalmueslie.openbooking.backend.request.api

data class BookingConfirmationContent(
    val subject: String,
    val content: String,
    val silent: Boolean
)
