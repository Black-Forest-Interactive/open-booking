package de.sambalmueslie.openbooking.backend.request.db

import de.sambalmueslie.openbooking.backend.request.api.BookingRequest
import de.sambalmueslie.openbooking.backend.request.api.BookingRequestStatus
import de.sambalmueslie.openbooking.common.DataObject
import jakarta.persistence.*
import java.time.LocalDateTime

@Suppress("JpaObjectClassSignatureInspection")
@Entity(name = "BookingRequest")
@Table(name = "booking_request")
data class BookingRequestData(
    @Id @GeneratedValue(strategy = GenerationType.SEQUENCE) var id: Long,
    @Column var key: String,

    @Column @Enumerated(EnumType.STRING) var status: BookingRequestStatus,
    @Column var visitorGroupId: Long,
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

