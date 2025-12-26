package de.sambalmueslie.openbooking.core.offer.api

import java.time.Duration
import java.time.LocalDateTime
import java.time.LocalTime

data class OfferSeriesRequest(
    val maxPersons: Int,
    val start: LocalDateTime,
    val duration: Duration,
    val interval: Duration,
    val quantity: Int,
    val minTime: LocalTime,
    val maxTime: LocalTime,
)
