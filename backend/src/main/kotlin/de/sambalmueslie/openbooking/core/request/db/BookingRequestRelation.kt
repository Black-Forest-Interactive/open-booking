package de.sambalmueslie.openbooking.core.request.db

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Table


@Suppress("JpaObjectClassSignatureInspection", "JpaMissingIdInspection")
@Entity(name = "BookingRequestRelation")
@Table(name = "booking_request_booking")
data class BookingRequestRelation(
    @Column val bookingId: Long,
    @Column val bookingRequestId: Long
)
