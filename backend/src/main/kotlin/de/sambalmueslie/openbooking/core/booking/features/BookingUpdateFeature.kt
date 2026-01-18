package de.sambalmueslie.openbooking.core.booking.features

import de.sambalmueslie.openbooking.core.booking.api.BookingChangeRequest
import de.sambalmueslie.openbooking.core.booking.api.BookingOfferInvalid
import de.sambalmueslie.openbooking.core.booking.api.BookingOfferNotSuitable
import de.sambalmueslie.openbooking.core.booking.db.BookingData
import jakarta.inject.Singleton
import org.slf4j.LoggerFactory

@Singleton
class BookingUpdateFeature(
    private val validateSizeFeature: BookingValidateSizeFeature,
    private val changeOfferFeature: BookingChangeOfferFeature,
    private val visitorFeature: BookingVisitorFeature,
    private val confirmFeature: BookingConfirmFeature,
) {
    companion object {
        private val logger = LoggerFactory.getLogger(BookingUpdateFeature::class.java)
    }


    fun updateData(data: BookingData, request: BookingChangeRequest): BookingData {
        val offer = changeOfferFeature.migrate(data, request.offerId) ?: throw BookingOfferInvalid(request.offerId)
        val suitable = validateSizeFeature.validate(request, offer)
        if (!suitable) throw BookingOfferNotSuitable(request.offerId)

        visitorFeature.update(data, request)
        confirmFeature.update(data, request)

        return data
    }


}