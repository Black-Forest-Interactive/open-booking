package de.sambalmueslie.openbooking.core.search.booking.api

import de.sambalmueslie.openbooking.core.booking.api.BookingDetails
import de.sambalmueslie.openbooking.core.booking.api.BookingStatus
import de.sambalmueslie.openbooking.core.search.common.SearchResponse
import io.micronaut.data.model.Page

data class BookingSearchResponse(
    override val result: Page<BookingDetails>,
    val status: Map<BookingStatus, Long>
) : SearchResponse<BookingDetails>
