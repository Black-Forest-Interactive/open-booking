package de.sambalmueslie.openbooking.core.booking.features

import de.sambalmueslie.openbooking.core.booking.api.BookingChangeRequest
import de.sambalmueslie.openbooking.core.booking.api.BookingResizeRequest
import de.sambalmueslie.openbooking.core.booking.api.BookingStatus
import de.sambalmueslie.openbooking.core.booking.db.BookingData
import de.sambalmueslie.openbooking.core.booking.db.BookingRepository
import de.sambalmueslie.openbooking.core.offer.api.Offer
import de.sambalmueslie.openbooking.core.visitor.api.VisitorType
import jakarta.inject.Singleton
import org.slf4j.LoggerFactory

@Singleton
class BookingValidateSizeFeature(
    private val repository: BookingRepository
) {
    companion object {
        private val logger = LoggerFactory.getLogger(BookingValidateSizeFeature::class.java)
    }

    fun validate(request: BookingChangeRequest, offer: Offer): Boolean {
        if (request.ignoreSizeCheck) return true
        val bookings = repository.findByOfferId(offer.id)
        if (request.visitor.type == VisitorType.GROUP) {
            val existingBookings = bookings.any { it.status == BookingStatus.PENDING || it.status == BookingStatus.CONFIRMED }
            if (!existingBookings) return true
        }
        return isSuitable(request.visitor.size, offer, bookings)
    }

    fun validate(request: BookingResizeRequest, offer: Offer): Boolean {
        if (request.ignoreSizeCheck) return true
        return isSuitable(request.visitor.size, offer, repository.findByOfferId(offer.id))
    }

    private fun isSuitable(visitorSize: Int, offer: Offer, bookings: List<BookingData>): Boolean {
        val spaceConfirmed = bookings
            .filter { it.status == BookingStatus.CONFIRMED || it.status == BookingStatus.PENDING }
            .sumOf { it.size }

        val spaceAvailable = offer.maxPersons - spaceConfirmed
        return spaceAvailable >= visitorSize
    }
}