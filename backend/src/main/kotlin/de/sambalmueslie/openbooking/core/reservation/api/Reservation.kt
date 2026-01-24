package de.sambalmueslie.openbooking.core.reservation.api

import de.sambalmueslie.openbooking.common.Entity
import java.time.LocalDateTime

data class Reservation(
    override val id: Long,
    val key: String,
    val comment: String,
    val status: ReservationStatus,
    val visitorId: Long,
    val offerId: Long,
    override val created: LocalDateTime,
    override val updated: LocalDateTime?,
) : Entity<Long>
