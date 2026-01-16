package de.sambalmueslie.openbooking.infrastructure.event.api

import java.time.LocalDateTime

data class ChangeEvent(
    val type: ChangeEventType,
    val resourceId: String,
    val resourceType: String,
    val timestamp: LocalDateTime,
)
