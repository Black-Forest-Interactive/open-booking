package de.sambalmueslie.openbooking.core.search.booking

import de.sambalmueslie.openbooking.core.booking.api.BookingStatus
import de.sambalmueslie.openbooking.core.search.common.LocalDateTimeSerializer
import de.sambalmueslie.openbooking.core.visitor.api.VerificationStatus
import de.sambalmueslie.openbooking.core.visitor.api.VisitorType
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
    var lang: String,
    @Serializable(with = LocalDateTimeSerializer::class) var created: LocalDateTime,
    @Serializable(with = LocalDateTimeSerializer::class) var updated: LocalDateTime?,
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

}