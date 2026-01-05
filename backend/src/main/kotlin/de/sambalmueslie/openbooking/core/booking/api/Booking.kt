package de.sambalmueslie.openbooking.core.booking.api

import de.sambalmueslie.openbooking.common.BusinessObject

data class Booking(
    override val id: Long,
    val status: BookingStatus,
    val size: Int,
    val comment: String,
    val offerId: Long,
    val visitorId: Long,
) : BusinessObject<Long>
