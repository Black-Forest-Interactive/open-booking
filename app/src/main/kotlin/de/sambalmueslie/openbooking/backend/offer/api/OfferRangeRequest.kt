package de.sambalmueslie.openbooking.backend.offer.api

import java.time.Duration
import java.time.LocalDate
import java.time.LocalTime

data class OfferRangeRequest(
    val maxPersons: Int,
    val dateFrom: LocalDate,
    val dateTo: LocalDate,
    val timeFrom: LocalTime,
    val timeTo: LocalTime,
    val duration: Duration,
    val interval: Duration
)
