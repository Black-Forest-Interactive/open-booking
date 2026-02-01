package de.sambalmueslie.openbooking.core.search.booking.api

import de.sambalmueslie.openbooking.core.booking.api.BookingStatus
import de.sambalmueslie.openbooking.core.search.common.SearchRequest
import java.time.LocalDate

data class BookingSearchRequest(
    val fullTextSearch: String,
    val status: List<BookingStatus>,
    val from: LocalDate?,
    val to: LocalDate?,
    val onlyMailConfirmed: Boolean?
) : SearchRequest
