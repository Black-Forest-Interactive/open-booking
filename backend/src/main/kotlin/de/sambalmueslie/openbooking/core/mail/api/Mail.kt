package de.sambalmueslie.openbooking.core.mail.api

data class Mail(
    val subject: String,
    val htmlText: String?,
    val plainText: String?
)
