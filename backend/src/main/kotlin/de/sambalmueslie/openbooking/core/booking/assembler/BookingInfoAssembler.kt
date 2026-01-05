package de.sambalmueslie.openbooking.core.booking.assembler

import de.sambalmueslie.openbooking.common.findByIdOrNull
import de.sambalmueslie.openbooking.core.booking.api.BookingInfo
import de.sambalmueslie.openbooking.core.booking.api.BookingStatus
import de.sambalmueslie.openbooking.core.booking.db.BookingData
import de.sambalmueslie.openbooking.core.booking.db.BookingRepository
import de.sambalmueslie.openbooking.core.offer.OfferService
import de.sambalmueslie.openbooking.core.offer.api.Offer
import de.sambalmueslie.openbooking.core.visitor.VisitorService
import de.sambalmueslie.openbooking.core.visitor.api.Visitor
import io.micronaut.data.model.Page
import io.micronaut.data.model.Pageable
import jakarta.inject.Singleton
import org.slf4j.LoggerFactory

@Singleton
class BookingInfoAssembler(
    private val repository: BookingRepository,
    private val offerService: OfferService,
    private val visitorService: VisitorService
) {

    companion object {
        private val logger = LoggerFactory.getLogger(BookingInfoAssembler::class.java)
    }

    fun getAllInfos(pageable: Pageable): Page<BookingInfo> {
        return pageToInfo { repository.findAll(pageable) }
    }

    fun getInfo(id: Long): BookingInfo? {
        return dataToInfo { repository.findByIdOrNull(id) }
    }

    fun getInfoByIds(ids: Set<Long>): List<BookingInfo> {
        return listToInfo { repository.findByIdIn(ids) }
    }

    fun getInfoByOfferId(offerId: Long): List<BookingInfo> {
        return listToInfo { repository.findByOfferId(offerId) }
    }

    fun getInfoByOfferIds(offerIds: Set<Long>): List<BookingInfo> {
        return listToInfo { repository.findByOfferIdIn(offerIds) }
    }

    private fun pageToInfo(provider: () -> Page<BookingData>): Page<BookingInfo> {
        return info(provider.invoke())
    }

    private fun listToInfo(provider: () -> List<BookingData>): List<BookingInfo> {
        return info(provider.invoke())
    }

    private fun dataToInfo(provider: () -> BookingData?): BookingInfo? {
        val data = provider.invoke() ?: return null
        return info(data)
    }


    private fun info(data: Page<BookingData>): Page<BookingInfo> {
        val result = info(data.content)
        return Page.of(result, data.pageable, data.totalSize)
    }


    private fun info(data: List<BookingData>): List<BookingInfo> {
        val offerIds = data.map { it.offerId }.toSet()
        val offer = offerService.getByIds(offerIds).associateBy { it.id }

        val visitorIds = data.map { it.visitorId }.toSet()
        val visitors = visitorService.getVisitors(visitorIds).associateBy { it.id }

        val confirmedBookings = repository.findByOfferIdInAndStatus(offerIds, BookingStatus.CONFIRMED).groupBy { it.offerId }

        return data.mapNotNull { info(it, offer, visitors, confirmedBookings[it.offerId] ?: emptyList()) }
    }

    private fun info(data: BookingData, offers: Map<Long, Offer>, visitors: Map<Long, Visitor>, confirmedBookings: List<BookingData>): BookingInfo? {
        val offer = offers[data.offerId] ?: return null
        val visitor = visitors[data.visitorId] ?: return null

        return info(data, offer, visitor, confirmedBookings)
    }

    private fun info(data: BookingData): BookingInfo? {
        val offer = offerService.get(data.offerId) ?: return null
        val visitor = visitorService.get(data.visitorId) ?: return null
        val confirmedBookings = repository.findByOfferIdAndStatus(offer.id, BookingStatus.CONFIRMED)
        return info(data, offer, visitor, confirmedBookings)
    }

    private fun info(data: BookingData, offer: Offer, visitor: Visitor, confirmedBookings: List<BookingData>): BookingInfo {
        val spaceConfirmed = confirmedBookings.sumOf { visitorService.get(it.visitorId)?.size ?: 0 }
        val spaceAvailable = (offer.maxPersons - spaceConfirmed).coerceAtLeast(0)

        val timestamp = data.updated ?: data.created
        return BookingInfo(data.id, offer, visitor, spaceAvailable, spaceConfirmed, data.status, timestamp)
    }

}