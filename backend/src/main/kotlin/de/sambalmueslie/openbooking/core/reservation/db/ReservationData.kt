package de.sambalmueslie.openbooking.core.reservation.db

import de.sambalmueslie.openbooking.common.DataObject
import de.sambalmueslie.openbooking.core.booking.api.Booking
import de.sambalmueslie.openbooking.core.reservation.api.Reservation
import de.sambalmueslie.openbooking.core.reservation.api.ReservationChangeRequest
import de.sambalmueslie.openbooking.core.reservation.api.ReservationStatus
import jakarta.persistence.*
import java.time.LocalDateTime

@Entity(name = "Reservation")
@Table(name = "reservation")
data class ReservationData(
    @Id @GeneratedValue var id: Long,
    @Column var key: String,
    @Column @Enumerated(EnumType.STRING) var status: ReservationStatus,
    @Column var comment: String,

    @Column var visitorId: Long,
    @Column var offerId: Long,
    @Column var bookingId: Long?,

    @Column var created: LocalDateTime,
    @Column var updated: LocalDateTime? = null,
) : DataObject<Reservation> {
    override fun convert() = Reservation(id, key, comment, status, visitorId, offerId)

    fun update(request: ReservationChangeRequest, timestamp: LocalDateTime): ReservationData {
        comment = request.comment
        updated = timestamp
        return this
    }

    fun setStatus(status: ReservationStatus, timestamp: LocalDateTime): ReservationData {
        this.status = status
        updated = timestamp
        return this
    }

    fun setBooking(booking: Booking, timestamp: LocalDateTime): ReservationData {
        status = ReservationStatus.CONFIRMED
        bookingId = booking.id
        updated = timestamp
        return this
    }
}