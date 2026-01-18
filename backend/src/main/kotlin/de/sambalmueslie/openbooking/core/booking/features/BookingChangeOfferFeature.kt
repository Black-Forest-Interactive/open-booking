package de.sambalmueslie.openbooking.core.booking.features

import de.sambalmueslie.openbooking.common.TimeProvider
import de.sambalmueslie.openbooking.core.booking.api.BookingOfferInvalid
import de.sambalmueslie.openbooking.core.booking.db.BookingData
import de.sambalmueslie.openbooking.core.offer.OfferService
import de.sambalmueslie.openbooking.core.offer.api.Offer
import de.sambalmueslie.openbooking.core.visitor.VisitorService
import jakarta.inject.Singleton

@Singleton
class BookingChangeOfferFeature(
    private val offerService: OfferService,
    private val visitorService: VisitorService,

    private val validateSizeFeature: BookingValidateSizeFeature,

    private val timeProvider: TimeProvider,
) {

    fun migrate(data: BookingData, newOfferId: Long): Offer? {
        if (data.offerId == newOfferId) return offerService.get(data.offerId)

        val formerOffer = offerService.get(data.offerId) ?: throw BookingOfferInvalid(data.offerId)
        val newOffer = offerService.get(newOfferId) ?: throw BookingOfferInvalid(newOfferId)

        // TODO send offer changed message

        data.update(newOffer, timeProvider.now())
        return newOffer
    }
}