package de.sambalmueslie.openbooking.backend.request.api

import de.sambalmueslie.openbooking.backend.booking.api.BookingInfo
import de.sambalmueslie.openbooking.backend.group.api.VisitorGroup
import java.time.LocalDateTime

data class BookingRequestInfo(
    val id: Long,
    val visitorGroup: VisitorGroup,
    val bookings: List<BookingInfo>,
    val status: BookingRequestStatus,
    val comment: String,
    val timestamp: LocalDateTime
)
