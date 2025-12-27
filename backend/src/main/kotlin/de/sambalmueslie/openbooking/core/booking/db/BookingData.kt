package de.sambalmueslie.openbooking.core.booking.db

import de.sambalmueslie.openbooking.common.DataObject
import de.sambalmueslie.openbooking.core.booking.api.Booking
import de.sambalmueslie.openbooking.core.booking.api.BookingChangeRequest
import de.sambalmueslie.openbooking.core.booking.api.BookingStatus
import de.sambalmueslie.openbooking.core.group.api.VisitorGroup
import jakarta.persistence.*
import java.time.LocalDateTime

@Suppress("JpaObjectClassSignatureInspection")
@Entity(name = "Booking")
@Table(name = "booking")
data class BookingData(
    @Id @GeneratedValue(strategy = GenerationType.SEQUENCE) var id: Long,
    @Column var offerId: Long,
    @Column var visitorGroupId: Long,
    @Column @Enumerated(EnumType.STRING) var status: BookingStatus,
    @Column var size: Int,
    @Column var created: LocalDateTime,
    @Column var updated: LocalDateTime? = null,
) : DataObject<Booking> {
    companion object {
        fun create(request: BookingChangeRequest, visitorGroup: VisitorGroup, timestamp: LocalDateTime): BookingData {
            return BookingData(0, request.offerId, visitorGroup.id, BookingStatus.UNCONFIRMED, visitorGroup.size, timestamp)
        }
    }

    override fun convert() = Booking(id, offerId, visitorGroupId, size, status)

    fun update(request: BookingChangeRequest, visitorGroup: VisitorGroup, timestamp: LocalDateTime): BookingData {
        offerId = request.offerId
        visitorGroupId = visitorGroup.id
        size = visitorGroup.size
        updated = timestamp
        return this
    }

    fun update(status: BookingStatus, timestamp: LocalDateTime): BookingData {
        this.status = status
        updated = timestamp
        return this
    }

    fun update(visitorGroup: VisitorGroup, timestamp: LocalDateTime): BookingData {
        this.size = visitorGroup.size
        updated = timestamp
        return this
    }

    fun update(visitorGroup: VisitorGroup, status: BookingStatus, timestamp: LocalDateTime): BookingData {
        this.size = visitorGroup.size
        this.status = status
        updated = timestamp
        return this
    }
}
