package de.sambalmueslie.openbooking.core.dashboard

import de.sambalmueslie.openbooking.core.booking.BookingService
import de.sambalmueslie.openbooking.core.dashboard.api.BookingEntry
import de.sambalmueslie.openbooking.core.dashboard.api.OfferEntry
import de.sambalmueslie.openbooking.core.guide.GuideService
import de.sambalmueslie.openbooking.core.offer.OfferService
import de.sambalmueslie.openbooking.core.request.BookingRequestService
import de.sambalmueslie.openbooking.core.request.api.BookingRequestStatus
import de.sambalmueslie.openbooking.core.visitor.VisitorService
import de.sambalmueslie.openbooking.gateway.admin.dashboard.DailyOffersFilterRequest
import jakarta.inject.Singleton
import java.time.LocalDate

@Singleton
class OfferEntryProvider(
    private val offerService: OfferService,
    private val bookingService: BookingService,
    private val requestService: BookingRequestService,
    private val groupService: VisitorService,
    private val guideService: GuideService,
) {

    @Deprecated("just temporary")
    private val colors = listOf(
        "#0070C0", // dark blue
        "#A6A6A6", // gray
        "#BF8F00", // gold
        "#B4C6E7", // light blue
        "#000000", // black
        "#00B050", // green
        "#FFFFFF", // white
        "#FF0000", // red
        "#FF99FF", // pink
        "#FF9900", // orange
        "#7030A0", // purple
        "#FFFF00"  // yellow
    )

    fun getDailyOffers(day: LocalDate, request: DailyOffersFilterRequest?): List<OfferEntry> {
        val offers = offerService.getOffer(day).sortedBy { it.start }

        return offers.mapIndexed { index, offer ->
            val request = requestService.findByOfferId(offer.id)

            val bookings = request.map {
                val confirmed = it.status == BookingRequestStatus.CONFIRMED
                BookingEntry(it.id, it.visitor, confirmed, it.status, it.comment, false, false, it.timestamp)
            }

            val confirmedSeats = bookings.filter { it.confirmed }.sumOf { it.visitor.size }
            val pendingSeats = bookings.filterNot { it.confirmed }.sumOf { it.visitor.size }

            OfferEntry(offer.id, offer.start, offer.finish, colors[index % colors.size], offer.maxPersons, confirmedSeats, pendingSeats, offer.active, null, bookings)
        }

    }
}