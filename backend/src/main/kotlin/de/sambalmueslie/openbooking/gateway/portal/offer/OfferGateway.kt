package de.sambalmueslie.openbooking.gateway.portal.offer

import de.sambalmueslie.openbooking.core.info.InfoService
import de.sambalmueslie.openbooking.core.info.api.DayInfoOffer
import de.sambalmueslie.openbooking.core.offer.OfferService
import jakarta.inject.Singleton
import org.slf4j.LoggerFactory

@Singleton
class OfferGateway(
    private val offerService: OfferService,
    private val infoService: InfoService,
) {
    companion object {
        private val logger = LoggerFactory.getLogger(OfferGateway::class.java)
    }

    fun get(offerId: Long): DayInfoOffer? {
        val offer = offerService.get(offerId) ?: return null
        val date = offer.start.toLocalDate()
        val dayInfo = infoService.getDayInfo(date) ?: return null

        return dayInfo.offer.find { it.offer.id == offer.id }
    }

    fun getInfo(request: OfferInfoSelectRequest): List<OfferInfoSelectResultEntry> {
        val dayInfos = request.dates.associateWith { infoService.getDayInfo(it) }

        return dayInfos.mapNotNull { (date, info) ->
            if (info == null) {
                null
            } else {
                val offer = info.offer.filter { isSpaceAvailable(it, request) }
                OfferInfoSelectResultEntry(date, offer)
            }
        }
    }

    private fun isSpaceAvailable(offer: DayInfoOffer, request: OfferInfoSelectRequest): Boolean {
        return offer.assignment.availableSpace >= request.groupSize
    }
}