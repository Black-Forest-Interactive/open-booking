package de.sambalmueslie.openbooking.core.reservation.db

import de.sambalmueslie.openbooking.common.DataObject
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

    @Column var created: LocalDateTime,
    @Column var updated: LocalDateTime? = null,
) : DataObject<Reservation> {
    override fun convert() = Reservation(id, key, comment, status)

    fun update(request: ReservationChangeRequest, now: LocalDateTime): ReservationData {
        comment = request.comment
        updated = now
        return this
    }
}