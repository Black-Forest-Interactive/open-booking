package de.sambalmueslie.openbooking.core.booking.features

import de.sambalmueslie.openbooking.core.booking.api.BookingConfirmationContent
import de.sambalmueslie.openbooking.core.booking.api.BookingStatus
import de.sambalmueslie.openbooking.core.booking.db.BookingData
import jakarta.inject.Singleton
import org.slf4j.LoggerFactory

@Singleton
class BookingDeclineFeature {
    companion object {
        private val logger = LoggerFactory.getLogger(BookingDeclineFeature::class.java)
    }

    fun decline(data: BookingData, content: BookingConfirmationContent): Boolean {
        if (data.status != BookingStatus.PENDING) return false
        TODO("Not yet implemented")
    }
}