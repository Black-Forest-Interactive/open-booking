package de.sambalmueslie.openbooking.core.booking.db

import de.sambalmueslie.openbooking.common.DataObject
import de.sambalmueslie.openbooking.core.booking.api.Booking
import de.sambalmueslie.openbooking.core.booking.api.BookingChangeRequest
import de.sambalmueslie.openbooking.core.booking.api.BookingStatus
import de.sambalmueslie.openbooking.core.visitor.api.Visitor
import jakarta.persistence.*
import java.time.LocalDateTime

@Entity(name = "Booking")
@Table(name = "booking")
data class BookingData(
    @Id @GeneratedValue var id: Long,
    @Column var offerId: Long,
    @Column var visitorGroupId: Long,
    @Column @Enumerated(EnumType.STRING) var status: BookingStatus,
    @Column var size: Int,
    @Column var created: LocalDateTime,
    @Column var updated: LocalDateTime? = null,
) : DataObject<Booking> {
    companion object {
        fun create(request: BookingChangeRequest, visitor: Visitor, timestamp: LocalDateTime): BookingData {
            return BookingData(0, request.offerId, visitor.id, BookingStatus.UNCONFIRMED, visitor.size, timestamp)
        }
    }

    override fun convert() = Booking(id, offerId, visitorGroupId, size, status)

    fun update(request: BookingChangeRequest, visitor: Visitor, timestamp: LocalDateTime): BookingData {
        offerId = request.offerId
        visitorGroupId = visitor.id
        size = visitor.size
        updated = timestamp
        return this
    }

    fun update(status: BookingStatus, timestamp: LocalDateTime): BookingData {
        this.status = status
        updated = timestamp
        return this
    }

    fun update(visitor: Visitor, timestamp: LocalDateTime): BookingData {
        this.size = visitor.size
        updated = timestamp
        return this
    }

    fun update(visitor: Visitor, status: BookingStatus, timestamp: LocalDateTime): BookingData {
        this.size = visitor.size
        this.status = status
        updated = timestamp
        return this
    }
}
