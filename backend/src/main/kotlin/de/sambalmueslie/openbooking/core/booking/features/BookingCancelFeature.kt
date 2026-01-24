package de.sambalmueslie.openbooking.core.booking.features

import de.sambalmueslie.openbooking.common.TimeProvider
import de.sambalmueslie.openbooking.core.booking.api.BookingStatus
import de.sambalmueslie.openbooking.core.booking.db.BookingData
import jakarta.inject.Singleton
import org.slf4j.LoggerFactory

@Singleton
class BookingCancelFeature(
    private val timeProvider: TimeProvider
) {
    companion object {
        private val logger = LoggerFactory.getLogger(BookingCancelFeature::class.java)
    }

    fun cancel(data: BookingData): Boolean {
        val cancelable = when (data.status) {
            BookingStatus.PENDING -> true
            BookingStatus.EXPIRED -> true
            BookingStatus.CONFIRMED -> true
            BookingStatus.UNKNOWN -> true
            BookingStatus.DECLINED -> false
            BookingStatus.CANCELLED -> false
        }
        if (cancelable) {
            data.update(BookingStatus.CANCELLED, timeProvider.now())
        }
        return cancelable
    }
}