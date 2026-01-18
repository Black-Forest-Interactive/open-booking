package de.sambalmueslie.openbooking.core.booking.features

import de.sambalmueslie.openbooking.common.TimeProvider
import de.sambalmueslie.openbooking.core.booking.api.BookingChangeRequest
import de.sambalmueslie.openbooking.core.booking.api.BookingOfferInvalid
import de.sambalmueslie.openbooking.core.booking.api.BookingOfferNotSuitable
import de.sambalmueslie.openbooking.core.booking.db.BookingData
import de.sambalmueslie.openbooking.core.offer.OfferService
import jakarta.inject.Singleton
import org.slf4j.LoggerFactory
import java.util.*

@Singleton
class BookingCreateFeature(
    private val offerService: OfferService,

    private val validateSizeFeature: BookingValidateSizeFeature,
    private val visitorFeature: BookingVisitorFeature,
    private val confirmFeature: BookingConfirmFeature,

    private val timeProvider: TimeProvider,
) {
    companion object {
        private val logger = LoggerFactory.getLogger(BookingCreateFeature::class.java)
    }

    fun create(request: BookingChangeRequest): BookingData {
        val offer = offerService.get(request.offerId) ?: throw BookingOfferInvalid(request.offerId)
        val suitable = validateSizeFeature.validate(request, offer)
        if (!suitable) throw BookingOfferNotSuitable(request.offerId)

        val visitor = visitorFeature.create(request)

        val key = UUID.randomUUID().toString().uppercase()
        val status = confirmFeature.create(request)
        return BookingData(0, key, status, visitor.size, request.comment, offer.id, visitor.id, timeProvider.now())
    }
}