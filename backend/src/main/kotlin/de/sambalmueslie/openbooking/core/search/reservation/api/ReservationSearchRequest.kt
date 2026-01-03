package de.sambalmueslie.openbooking.core.search.reservation.api

import de.sambalmueslie.openbooking.core.search.common.SearchRequest

data class ReservationSearchRequest(
    val fullTextSearch: String
) : SearchRequest
