package de.sambalmueslie.openbooking.core.request.db

import de.sambalmueslie.openbooking.common.DataObject
import de.sambalmueslie.openbooking.core.request.api.BookingRequest
import de.sambalmueslie.openbooking.core.request.api.BookingRequestStatus
import jakarta.persistence.*
import java.time.LocalDateTime

@Entity(name = "BookingRequest")
@Table(name = "booking_request")
@Deprecated("use reservation instead.", ReplaceWith("reservation"))
data class BookingRequestData(
    @Id @GeneratedValue var id: Long,
    @Column var key: String,

    @Column @Enumerated(EnumType.STRING) var status: BookingRequestStatus,
    @Column var visitorId: Long,
    @Column var comment: String,

    @Column var created: LocalDateTime,
    @Column var updated: LocalDateTime? = null,
) : DataObject<BookingRequest> {


    override fun convert() = BookingRequest(id, key, comment, status)


    fun setStatus(status: BookingRequestStatus, timestamp: LocalDateTime): BookingRequestData {
        this.status = status
        this.updated = timestamp
        return this
    }

    fun setComment(comment: String, timestamp: LocalDateTime): BookingRequestData {
        this.comment = comment
        this.updated = timestamp
        return this
    }

}

