package de.sambalmueslie.openbooking.core.search.reservation.api

import de.sambalmueslie.openbooking.core.reservation.api.ReservationStatus
import de.sambalmueslie.openbooking.core.search.common.SearchRequest
import java.time.LocalDate

data class ReservationSearchRequest(
    val fullTextSearch: String,
    val status: List<ReservationStatus>,
    val from: LocalDate?,
    val to: LocalDate?,
) : SearchRequest
