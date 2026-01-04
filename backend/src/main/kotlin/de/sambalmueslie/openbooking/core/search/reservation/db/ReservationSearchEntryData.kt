package de.sambalmueslie.openbooking.core.search.reservation.db

import de.sambalmueslie.openbooking.core.reservation.api.Reservation
import de.sambalmueslie.openbooking.core.reservation.api.ReservationOfferEntry
import de.sambalmueslie.openbooking.core.reservation.api.ReservationStatus
import de.sambalmueslie.openbooking.core.search.common.LocalDateTimeSerializer
import de.sambalmueslie.openbooking.core.search.reservation.api.ReservationSearchEntry
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
    @Serializable(with = LocalDateTimeSerializer::class)
    var timestamp: LocalDateTime,
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
    // offer
    var offers: List<ReservationOfferEntryData>
) {


    fun convert() = ReservationSearchEntry(
        Reservation(id.toLong(), key, comment, status),
        Visitor(visitorId, type, title, description, size, minAge, maxAge, name, Address(street, city, zip), phone, email, Verification(verificationStatus, verificationTimestamp)),
        offers.map { ReservationOfferEntry(it.offerId, it.priority) },
        timestamp
    )
}