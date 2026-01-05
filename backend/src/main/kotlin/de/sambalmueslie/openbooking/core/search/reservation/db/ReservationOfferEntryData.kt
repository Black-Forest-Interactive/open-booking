package de.sambalmueslie.openbooking.core.search.reservation.db

import de.sambalmueslie.openbooking.core.offer.api.Assignment
import de.sambalmueslie.openbooking.core.offer.api.Offer
import de.sambalmueslie.openbooking.core.reservation.api.ReservationOfferEntry
import de.sambalmueslie.openbooking.core.search.common.LocalDateTimeSerializer
import kotlinx.serialization.Serializable
import java.time.LocalDateTime

@Serializable
data class ReservationOfferEntryData(
    var offerId: Long,
    @Serializable(with = LocalDateTimeSerializer::class) var start: LocalDateTime,
    @Serializable(with = LocalDateTimeSerializer::class) var finish: LocalDateTime,
    var maxPersons: Int,
    var active: Boolean,

    var bookedSpace: Int,
    var reservedSpace: Int,
    var availableSpace: Int,
    var priority: Int
) {
    fun convert() = ReservationOfferEntry(
        Offer(offerId, start, finish, maxPersons, active),
        Assignment(bookedSpace, reservedSpace, availableSpace),
        priority
    )
}