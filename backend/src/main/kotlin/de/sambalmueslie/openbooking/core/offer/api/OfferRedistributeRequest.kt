package de.sambalmueslie.openbooking.core.offer.api

import java.time.Duration
import java.time.LocalDate
import java.time.LocalTime

data class OfferRedistributeRequest(
    val date: LocalDate,
    val timeFrom: LocalTime,
    val timeTo: LocalTime,
    val duration: Duration,
)
