package de.sambalmueslie.openbooking.core.request.api

import de.sambalmueslie.openbooking.core.booking.api.BookingInfo
import de.sambalmueslie.openbooking.core.group.api.VisitorGroup
import java.time.LocalDateTime

data class BookingRequestInfo(
    val id: Long,
    val visitorGroup: VisitorGroup,
    val bookings: List<BookingInfo>,
    val status: BookingRequestStatus,
    val comment: String,
    val timestamp: LocalDateTime
)
