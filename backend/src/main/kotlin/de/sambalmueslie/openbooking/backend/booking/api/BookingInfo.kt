package de.sambalmueslie.openbooking.backend.booking.api

import de.sambalmueslie.openbooking.backend.offer.api.Offer
import java.time.LocalDateTime

data class BookingInfo(
    val id: Long,
    val offer: Offer,
    val spaceAvailable: Int,
    val spaceConfirmed: Int,
    val status: BookingStatus,
    val timestamp: LocalDateTime
)
