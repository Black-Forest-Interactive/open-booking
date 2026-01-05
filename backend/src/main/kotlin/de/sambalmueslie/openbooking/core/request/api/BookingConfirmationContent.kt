package de.sambalmueslie.openbooking.core.request.api

@Deprecated("use reservation instead.", ReplaceWith("reservation"))
data class BookingConfirmationContent(
    val subject: String,
    val content: String,
    val silent: Boolean
)
