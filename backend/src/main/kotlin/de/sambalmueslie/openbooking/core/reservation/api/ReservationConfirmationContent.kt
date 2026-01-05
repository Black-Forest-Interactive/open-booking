package de.sambalmueslie.openbooking.core.reservation.api

data class ReservationConfirmationContent(
    val subject: String,
    val content: String,
    val silent: Boolean
)
