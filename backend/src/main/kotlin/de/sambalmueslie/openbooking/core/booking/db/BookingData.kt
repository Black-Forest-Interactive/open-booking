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
    @Column var key: String,
    @Column @Enumerated(EnumType.STRING) var status: BookingStatus,
    @Column var size: Int,
    @Column var comment: String,

    @Column var offerId: Long,
    @Column var visitorId: Long,

    @Column var created: LocalDateTime,
    @Column var updated: LocalDateTime? = null,
) : DataObject<Booking> {

    override fun convert() = Booking(id, status, size, comment, offerId, visitorId)

    fun update(request: BookingChangeRequest, visitor: Visitor, timestamp: LocalDateTime): BookingData {
        offerId = request.offerId
        visitorId = visitor.id
        size = visitor.size
        comment = request.comment
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
