package de.sambalmueslie.openbooking.core.search.offer.db

import de.sambalmueslie.openbooking.core.offer.api.Offer
import de.sambalmueslie.openbooking.core.search.common.LocalDateTimeSerializer
import de.sambalmueslie.openbooking.core.search.offer.api.OfferSearchEntry
import kotlinx.serialization.Serializable
import java.time.LocalDateTime

@Serializable
data class OfferSearchEntryData(
    val id: Long,
    @Serializable(with = LocalDateTimeSerializer::class) val start: LocalDateTime,
    @Serializable(with = LocalDateTimeSerializer::class) val finish: LocalDateTime,
    val maxPersons: Int,
    val active: Boolean,

    val bookedSeats: Int,
    val reservedSeats: Int,
    val availableSeats: Int,

    val reservations: List<OfferReservationEntryData>,
    val bookings: List<OfferBookingEntryData>

) {
    fun convert() = OfferSearchEntry(
        Offer(id, start, finish, maxPersons, active),
        reservations.map { it.convert() },
        bookings.map { it.convert() }
    )
}
