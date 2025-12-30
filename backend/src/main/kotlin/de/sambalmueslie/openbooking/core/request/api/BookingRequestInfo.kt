package de.sambalmueslie.openbooking.core.request.api

import de.sambalmueslie.openbooking.core.booking.api.BookingInfo
import de.sambalmueslie.openbooking.core.visitor.api.Visitor
import java.time.LocalDateTime

@Deprecated("use reservation instead.", ReplaceWith("reservation"))
data class BookingRequestInfo(
    val id: Long,
    val visitor: Visitor,
    val bookings: List<BookingInfo>,
    val status: BookingRequestStatus,
    val comment: String,
    val timestamp: LocalDateTime
)
