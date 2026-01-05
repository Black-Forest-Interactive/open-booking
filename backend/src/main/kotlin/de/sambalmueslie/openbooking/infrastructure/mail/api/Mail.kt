package de.sambalmueslie.openbooking.infrastructure.mail.api

data class Mail(
    val subject: String,
    val htmlText: String?,
    val plainText: String?
)
