package de.sambalmueslie.openbooking.core.search.reservation.api

import de.sambalmueslie.openbooking.core.reservation.api.ReservationDetails
import de.sambalmueslie.openbooking.core.reservation.api.ReservationStatus
import de.sambalmueslie.openbooking.core.search.common.SearchResponse
import io.micronaut.data.model.Page

data class ReservationSearchResponse(
    override val result: Page<ReservationDetails>,
    val status: Map<ReservationStatus, Long>
) : SearchResponse<ReservationDetails>
