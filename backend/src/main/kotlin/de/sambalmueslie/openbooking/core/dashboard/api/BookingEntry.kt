package de.sambalmueslie.openbooking.core.dashboard.api

import de.sambalmueslie.openbooking.core.group.api.VisitorGroup
import de.sambalmueslie.openbooking.core.request.api.BookingRequestStatus
import java.time.LocalDateTime

data class BookingEntry(
    val id: Long,
    val visitorGroup: VisitorGroup,
    val confirmed: Boolean,
    val status: BookingRequestStatus,
    val comment: String,
    val emailSent: Boolean,
    val emailDelivered: Boolean,
    val timestamp: LocalDateTime
)
