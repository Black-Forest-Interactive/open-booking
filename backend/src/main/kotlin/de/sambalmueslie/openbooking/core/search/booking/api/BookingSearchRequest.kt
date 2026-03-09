package de.sambalmueslie.openbooking.core.search.booking.api

import de.sambalmueslie.openbooking.core.booking.api.BookingStatus
import de.sambalmueslie.openbooking.core.search.common.SearchRequest
import de.sambalmueslie.openbooking.core.visitor.api.VerificationStatus
import de.sambalmueslie.openbooking.core.visitor.api.VisitorType
import java.time.LocalDate

data class BookingSearchRequest(
    val fullTextSearch: String,
    val status: List<BookingStatus>,
    val visitorType: List<VisitorType>,
    val verificationStatus: List<VerificationStatus>,
    val from: LocalDate?,
    val to: LocalDate?,
) : SearchRequest
