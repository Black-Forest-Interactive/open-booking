package de.sambalmueslie.openbooking.core.dashboard.api

import de.sambalmueslie.openbooking.core.request.api.BookingRequestStatus
import de.sambalmueslie.openbooking.core.visitor.api.Visitor
import java.time.LocalDateTime

data class BookingEntry(
    val id: Long,
    val visitor: Visitor,
    val confirmed: Boolean,
    val status: BookingRequestStatus,
    val comment: String,
    val emailSent: Boolean,
    val emailDelivered: Boolean,
    val timestamp: LocalDateTime
)
