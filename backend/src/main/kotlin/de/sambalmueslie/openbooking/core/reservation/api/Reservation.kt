package de.sambalmueslie.openbooking.core.reservation.api

import de.sambalmueslie.openbooking.common.BusinessObject

data class Reservation(
    override val id: Long,
    val key: String,
    val comment: String,
    val status: ReservationStatus,
    val visitorId: Long,
    val offerId: Long,
) : BusinessObject<Long>
