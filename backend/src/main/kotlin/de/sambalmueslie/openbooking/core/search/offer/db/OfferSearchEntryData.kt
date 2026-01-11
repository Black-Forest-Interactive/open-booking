package de.sambalmueslie.openbooking.core.search.offer.db

import de.sambalmueslie.openbooking.core.offer.api.Assignment
import de.sambalmueslie.openbooking.core.offer.api.OfferInfo
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

    var bookedSpace: Int,
    var reservedSpace: Int,
    var availableSpace: Int,

    var reservations: List<OfferReservationEntryData>,
    var bookings: List<OfferBookingEntryData>

) {
    fun convert(info: OfferInfo) = OfferSearchEntry(
        info,
        Assignment(bookedSpace, reservedSpace, availableSpace, if (active) 0 else maxPersons),
        reservations.map { it.convert() },
        bookings.map { it.convert() }
    )
}
