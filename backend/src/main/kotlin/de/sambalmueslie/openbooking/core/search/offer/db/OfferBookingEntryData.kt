package de.sambalmueslie.openbooking.core.search.offer.db

import de.sambalmueslie.openbooking.core.booking.api.BookingStatus
import de.sambalmueslie.openbooking.core.search.common.LocalDateTimeSerializer
import de.sambalmueslie.openbooking.core.search.offer.api.OfferBookingEntry
import de.sambalmueslie.openbooking.core.visitor.api.*
import kotlinx.serialization.Serializable
import java.time.LocalDateTime

@Serializable
data class OfferBookingEntryData(
    var bookingId: Long,
    var status: BookingStatus,
    // visitor
    var visitorId: Long,
    var type: VisitorType,
    var title: String,
    var description: String,

    var size: Int,
    var minAge: Int,
    var maxAge: Int,

    var name: String,
    var street: String,
    var city: String,
    var zip: String,
    var phone: String,
    var email: String,

    var verificationStatus: VerificationStatus,
    @Serializable(with = LocalDateTimeSerializer::class)
    var verificationTimestamp: LocalDateTime?,
) {
    fun convert() = OfferBookingEntry(
        bookingId,
        status,
        Visitor(
            visitorId,
            type,
            title,
            description,
            size,
            minAge,
            maxAge,
            name,
            Address(street, city, zip),
            phone,
            email,
            Verification(verificationStatus, verificationTimestamp)
        )
    )
}
