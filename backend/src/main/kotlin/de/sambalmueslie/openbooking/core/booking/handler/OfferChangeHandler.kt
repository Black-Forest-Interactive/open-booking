package de.sambalmueslie.openbooking.core.booking.handler

import de.sambalmueslie.openbooking.core.booking.BookingService
import de.sambalmueslie.openbooking.core.offer.OfferChangeListener
import de.sambalmueslie.openbooking.core.offer.OfferService
import de.sambalmueslie.openbooking.core.offer.api.Offer
import jakarta.inject.Singleton
import org.slf4j.LoggerFactory

@Singleton
class OfferChangeHandler(
    private val service: BookingService,
    offerService: OfferService,
) : OfferChangeListener {
    companion object {
        private val logger = LoggerFactory.getLogger(OfferChangeHandler::class.java)
    }

    init {
        offerService.register(this)
    }

    override fun handleDeleted(obj: Offer) {
        // TODO delete bookings and send out decline messages
//        val sequence = PageableSequence { repository.findByOfferId(obj.id, it) }
//        sequence.forEach { delete(it) }
    }
}