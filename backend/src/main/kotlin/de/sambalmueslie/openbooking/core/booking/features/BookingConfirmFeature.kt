package de.sambalmueslie.openbooking.core.booking.features

import de.sambalmueslie.openbooking.common.TimeProvider
import de.sambalmueslie.openbooking.core.booking.api.BookingChangeRequest
import de.sambalmueslie.openbooking.core.booking.api.BookingConfirmationContent
import de.sambalmueslie.openbooking.core.booking.api.BookingStatus
import de.sambalmueslie.openbooking.core.booking.db.BookingData
import de.sambalmueslie.openbooking.core.booking.db.BookingRepository
import jakarta.inject.Singleton
import org.slf4j.LoggerFactory

@Singleton
class BookingConfirmFeature(
    private val repository: BookingRepository,
    private val timeProvider: TimeProvider
) {
    companion object {
        private val logger = LoggerFactory.getLogger(BookingConfirmFeature::class.java)
    }

    fun create(request: BookingChangeRequest): BookingStatus {
        return if (request.autoConfirm) BookingStatus.CONFIRMED else BookingStatus.PENDING
    }

    fun update(data: BookingData, request: BookingChangeRequest) {
        val awaitConfirmation = data.status == BookingStatus.PENDING || data.status == BookingStatus.UNKNOWN
        if (request.autoConfirm && awaitConfirmation) {
            data.update(BookingStatus.CONFIRMED, timeProvider.now())
        }
    }

    fun confirm(data: BookingData, content: BookingConfirmationContent): Boolean {
        if (data.status != BookingStatus.PENDING) return false
        TODO("Not yet implemented")
    }
}