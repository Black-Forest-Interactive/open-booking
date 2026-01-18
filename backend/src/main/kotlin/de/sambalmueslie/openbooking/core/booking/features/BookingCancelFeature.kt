package de.sambalmueslie.openbooking.core.booking.features

import jakarta.inject.Singleton
import org.slf4j.LoggerFactory

@Singleton
class BookingCancelFeature {
    companion object {
        private val logger = LoggerFactory.getLogger(BookingCancelFeature::class.java)
    }
}