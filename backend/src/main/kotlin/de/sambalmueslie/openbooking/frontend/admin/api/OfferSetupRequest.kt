package de.sambalmueslie.openbooking.frontend.admin.api

import java.time.Duration
import java.time.LocalDate
import java.time.LocalTime

data class OfferSetupRequest(
    val startDate: LocalDate,
    val finishDate: LocalDate,
    val startTime: LocalTime,
    val finishTime: LocalTime,
    val maxPersons: Int,
    val duration: Duration
)
