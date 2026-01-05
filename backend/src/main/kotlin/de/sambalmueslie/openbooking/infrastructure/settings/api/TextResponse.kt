package de.sambalmueslie.openbooking.infrastructure.settings.api

import io.micronaut.serde.annotation.Serdeable

@Serdeable
data class TextResponse(
    val text: String
)
