package de.sambalmueslie.openbooking.core.search.offer.db

import de.sambalmueslie.openbooking.core.booking.api.BookingDetails
import de.sambalmueslie.openbooking.core.offer.api.Assignment
import de.sambalmueslie.openbooking.core.offer.api.Offer
import de.sambalmueslie.openbooking.core.offer.api.OfferInfo
import de.sambalmueslie.openbooking.core.offer.api.OfferReference
import de.sambalmueslie.openbooking.core.search.common.LocalDateTimeSerializer
import de.sambalmueslie.openbooking.core.search.offer.api.OfferSearchEntry
import kotlinx.serialization.Serializable
import java.time.LocalDateTime

@Serializable
data class OfferSearchEntryData(
    var id: Long,
    @Serializable(with = LocalDateTimeSerializer::class) var start: LocalDateTime,
    @Serializable(with = LocalDateTimeSerializer::class) var finish: LocalDateTime,
    var maxPersons: Int,
    var active: Boolean,

    var confirmedSpace: Int,
    var pendingSpace: Int,
    var availableSpace: Int,

    @Serializable(with = LocalDateTimeSerializer::class) var created: LocalDateTime,
    @Serializable(with = LocalDateTimeSerializer::class) var updated: LocalDateTime?,
    @Serializable(with = LocalDateTimeSerializer::class) var timestamp: LocalDateTime,

    var bookings: List<OfferBookingEntryData>

) {
    fun convert(info: OfferInfo, allBookings: Map<Long, BookingDetails>) = OfferSearchEntry(
        info,
        Assignment(confirmedSpace, pendingSpace, availableSpace, if (active) 0 else maxPersons),
        bookings.mapNotNull { allBookings[it.bookingId] }
    )

    fun toReference() = OfferReference(Offer(id, start, finish, maxPersons, active, created, updated), Assignment(confirmedSpace, pendingSpace, availableSpace, if (active) 0 else maxPersons))
}
