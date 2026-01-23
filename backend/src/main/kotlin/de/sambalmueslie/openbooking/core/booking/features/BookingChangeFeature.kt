package de.sambalmueslie.openbooking.core.booking.features

import de.sambalmueslie.openbooking.common.TimeProvider
import de.sambalmueslie.openbooking.core.booking.api.*
import de.sambalmueslie.openbooking.core.booking.db.BookingData
import de.sambalmueslie.openbooking.core.offer.OfferService
import jakarta.inject.Singleton
import org.slf4j.LoggerFactory
import java.util.*

@Singleton
class BookingChangeFeature(
    private val offerService: OfferService,

    private val validateSizeFeature: BookingValidateSizeFeature,
    private val changeOfferFeature: BookingChangeOfferFeature,
    private val visitorFeature: BookingVisitorFeature,
    private val confirmFeature: BookingConfirmFeature,

    private val timeProvider: TimeProvider,
) {
    companion object {
        private val logger = LoggerFactory.getLogger(BookingChangeFeature::class.java)
    }

    fun create(request: BookingChangeRequest): BookingData {
        val offer = offerService.get(request.offerId) ?: throw BookingOfferInvalid(request.offerId)
        val suitable = validateSizeFeature.validate(request, offer)
        if (!suitable) throw BookingOfferNotSuitable(request.offerId)

        val visitor = visitorFeature.create(request)

        val key = UUID.randomUUID().toString().uppercase()
        val status = confirmFeature.create(request)
        return BookingData(0, key, status, visitor.size, request.comment, request.lang, offer.id, visitor.id, timeProvider.now())
    }

    fun update(data: BookingData, request: BookingChangeRequest): BookingData {
        val offer = changeOfferFeature.migrate(data, request.offerId) ?: throw BookingOfferInvalid(request.offerId)
        val suitable = validateSizeFeature.validate(request, offer)
        if (!suitable) throw BookingOfferNotSuitable(request.offerId)

        visitorFeature.update(data, request)
        confirmFeature.update(data, request)

        return data
    }

    fun updateSize(data: BookingData, request: BookingResizeRequest): BookingData {
        val unchanged = data.size == request.visitor.size
        if (unchanged) return data

        if (request.visitor.size < 0) return data

        val requiresSizeValidation = data.size < request.visitor.size
        if (requiresSizeValidation) {
            val offer = offerService.get(data.offerId) ?: throw BookingOfferInvalid(data.id)
            val suitable = validateSizeFeature.validate(request, offer)
            if (!suitable) throw BookingOfferNotSuitable(offer.id)
        }

        visitorFeature.update(data, request) ?: throw BookingVisitorInvalid(data.visitorId)
        confirmFeature.update(data, request)

        data.setSize(request.visitor.size, timeProvider.now())
        return data
    }


}