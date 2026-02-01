package de.sambalmueslie.openbooking.core.booking.features

import de.sambalmueslie.openbooking.common.TimeProvider
import de.sambalmueslie.openbooking.core.booking.api.BookingConfirmationContent
import de.sambalmueslie.openbooking.core.booking.api.BookingStatus
import de.sambalmueslie.openbooking.core.booking.db.BookingData
import jakarta.inject.Singleton
import org.slf4j.LoggerFactory

@Singleton
class BookingDeclineFeature(
    private val timeProvider: TimeProvider
) {
    companion object {
        private val logger = LoggerFactory.getLogger(BookingDeclineFeature::class.java)
    }

    private val validStates = listOf(BookingStatus.PENDING, BookingStatus.CONFIRMED)

    fun decline(data: BookingData, content: BookingConfirmationContent): Boolean {
        if (!validStates.contains(data.status)) return false

        data.update(BookingStatus.DECLINED, timeProvider.now())
        return true
    }
}