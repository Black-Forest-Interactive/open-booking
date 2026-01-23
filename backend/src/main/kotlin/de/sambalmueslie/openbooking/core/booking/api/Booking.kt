package de.sambalmueslie.openbooking.core.booking.api

import de.sambalmueslie.openbooking.common.Entity

data class Booking(
    override val id: Long,
    val key: String,
    val status: BookingStatus,
    val size: Int,
    val comment: String,
    val lang: String,
    val offerId: Long,
    val visitorId: Long,
) : Entity<Long>
