package de.sambalmueslie.openbooking.core.booking.features

import jakarta.inject.Singleton
import org.slf4j.LoggerFactory

@Singleton
class BookingExpireFeature {
    companion object {
        private val logger = LoggerFactory.getLogger(BookingExpireFeature::class.java)
    }
}