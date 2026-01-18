package de.sambalmueslie.openbooking.core.search.booking

import de.sambalmueslie.openbooking.core.booking.api.Booking
import de.sambalmueslie.openbooking.core.booking.api.BookingDetails
import de.sambalmueslie.openbooking.core.booking.api.BookingStatus
import de.sambalmueslie.openbooking.core.offer.api.Assignment
import de.sambalmueslie.openbooking.core.offer.api.Offer
import de.sambalmueslie.openbooking.core.offer.api.OfferReference
import de.sambalmueslie.openbooking.core.search.common.LocalDateTimeSerializer
import de.sambalmueslie.openbooking.core.visitor.api.*
import kotlinx.serialization.Serializable
import java.time.LocalDateTime

@Serializable
data class BookingSearchEntryData(
    var id: String,
    // booking
    var key: String,
    var status: BookingStatus,
    var size: Int,
    var comment: String,
    @Serializable(with = LocalDateTimeSerializer::class) var timestamp: LocalDateTime,
    // visitor
    var visitorId: Long,
    var type: VisitorType,
    var title: String,
    var description: String,

    var visitorSize: Int,
    var minAge: Int,
    var maxAge: Int,

    var name: String,
    var street: String,
    var city: String,
    var zip: String,
    var phone: String,
    var email: String,

    var verificationStatus: VerificationStatus,
    @Serializable(with = LocalDateTimeSerializer::class) var verificationTimestamp: LocalDateTime?,
    // offer
    var offerId: Long,
    @Serializable(with = LocalDateTimeSerializer::class) var start: LocalDateTime,
    @Serializable(with = LocalDateTimeSerializer::class) var finish: LocalDateTime,
    var maxPersons: Int,
    var active: Boolean,

    var confirmedSpace: Int,
    var pendingSpace: Int,
    var availableSpace: Int,
) {


    fun convert() = BookingDetails(
        Booking(id.toLong(), key, status, size, comment, offerId, visitorId),
        Visitor(visitorId, type, title, description, visitorSize, minAge, maxAge, name, Address(street, city, zip), phone, email, Verification(verificationStatus, verificationTimestamp)),
        OfferReference(
            Offer(offerId, start, finish, maxPersons, active),
            Assignment(confirmedSpace, pendingSpace, availableSpace, if (active) 0 else maxPersons),
        ),
        timestamp,
        null
    )
}