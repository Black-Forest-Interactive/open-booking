package de.sambalmueslie.openbooking.core.offer

import de.sambalmueslie.openbooking.core.booking.assembler.BookingDetailsAssembler
import de.sambalmueslie.openbooking.core.guide.GuideService
import de.sambalmueslie.openbooking.core.label.LabelService
import de.sambalmueslie.openbooking.core.reservation.ReservationService
import jakarta.inject.Singleton
import org.slf4j.LoggerFactory

@Singleton
class OfferConverter(
    private val bookingAssembler: BookingDetailsAssembler,
    private val reservationService: ReservationService,
    private val labelService: LabelService,
    private val guideService: GuideService,
) {
    companion object {
        private val logger = LoggerFactory.getLogger(OfferConverter::class.java)
    }


}