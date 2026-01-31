package de.sambalmueslie.openbooking.core.offer.assembler

import de.sambalmueslie.openbooking.core.booking.api.Booking
import de.sambalmueslie.openbooking.core.booking.api.BookingDetails
import de.sambalmueslie.openbooking.core.booking.api.BookingStatus
import de.sambalmueslie.openbooking.core.offer.api.Assignment
import de.sambalmueslie.openbooking.core.offer.db.OfferData
import jakarta.inject.Singleton
import org.slf4j.LoggerFactory

@Singleton
class AssignmentProvider {

    companion object {
        private val logger = LoggerFactory.getLogger(AssignmentProvider::class.java)
    }

    fun getBookingDetailsAssignment(data: OfferData, bookings: List<BookingDetails>): Assignment {
        val bookedSpace = bookings.filter { it.booking.status == BookingStatus.CONFIRMED }.sumOf { it.booking.size }
        val reservedSpace = bookings.filter { it.booking.status == BookingStatus.PENDING }.sumOf { it.booking.size }
        val availableSpace = if (data.active) 0.coerceAtLeast(data.maxPersons - bookedSpace - reservedSpace) else 0
        val disabledSpace = if (data.active) 0 else data.maxPersons

        return Assignment(bookedSpace, reservedSpace, availableSpace, disabledSpace)
    }

    fun getBookingAssignment(data: OfferData, bookings: List<Booking>): Assignment {
        val bookedSpace = bookings.filter { it.status == BookingStatus.CONFIRMED }.sumOf { it.size }
        val reservedSpace = bookings.filter { it.status == BookingStatus.PENDING }.sumOf { it.size }
        val availableSpace = if (data.active) 0.coerceAtLeast(data.maxPersons - bookedSpace - reservedSpace) else 0
        val disabledSpace = if (data.active) 0 else data.maxPersons

        return Assignment(bookedSpace, reservedSpace, availableSpace, disabledSpace)
    }

}