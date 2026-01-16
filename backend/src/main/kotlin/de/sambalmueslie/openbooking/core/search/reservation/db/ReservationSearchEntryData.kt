package de.sambalmueslie.openbooking.core.search.reservation.db

import de.sambalmueslie.openbooking.core.offer.api.Assignment
import de.sambalmueslie.openbooking.core.offer.api.Offer
import de.sambalmueslie.openbooking.core.reservation.api.Reservation
import de.sambalmueslie.openbooking.core.reservation.api.ReservationDetails
import de.sambalmueslie.openbooking.core.reservation.api.ReservationOffer
import de.sambalmueslie.openbooking.core.reservation.api.ReservationStatus
import de.sambalmueslie.openbooking.core.search.common.LocalDateTimeSerializer
import de.sambalmueslie.openbooking.core.visitor.api.*
import kotlinx.serialization.Serializable
import java.time.LocalDateTime

@Serializable
data class ReservationSearchEntryData(
    var id: String,
    // reservation
    var key: String,
    var status: ReservationStatus,
    var comment: String,
    @Serializable(with = LocalDateTimeSerializer::class) var timestamp: LocalDateTime,
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
    @Serializable(with = LocalDateTimeSerializer::class) var verificationTimestamp: LocalDateTime?,
    // offer
    var offerId: Long,
    @Serializable(with = LocalDateTimeSerializer::class) var start: LocalDateTime,
    @Serializable(with = LocalDateTimeSerializer::class) var finish: LocalDateTime,
    var maxPersons: Int,
    var active: Boolean,

    var bookedSpace: Int,
    var reservedSpace: Int,
    var availableSpace: Int,
) {


    fun convert() = ReservationDetails(
        Reservation(id.toLong(), key, comment, status, visitorId, offerId),
        Visitor(visitorId, type, title, description, size, minAge, maxAge, name, Address(street, city, zip), phone, email, Verification(verificationStatus, verificationTimestamp)),
        ReservationOffer(
            Offer(offerId, start, finish, maxPersons, active),
            Assignment(bookedSpace, reservedSpace, availableSpace, if (active) 0 else maxPersons),
        ),
        timestamp,
        null
    )
}