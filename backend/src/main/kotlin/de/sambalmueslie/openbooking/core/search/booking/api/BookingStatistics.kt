package de.sambalmueslie.openbooking.core.search.booking.api

import de.sambalmueslie.openbooking.core.booking.api.BookingStatus
import de.sambalmueslie.openbooking.core.visitor.api.VerificationStatus
import de.sambalmueslie.openbooking.core.visitor.api.VisitorType

data class BookingStatistics(
    val bookingsByDay: List<DailyBookingStats>,
    val statusDistribution: Map<BookingStatus, BookingStatusStats>,
    val visitorTypeDistribution: Map<VisitorType, Long>,
    val verificationStatusDistribution: Map<VerificationStatus, Long>,
)
