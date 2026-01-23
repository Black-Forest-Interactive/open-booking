package de.sambalmueslie.openbooking.core.booking.assembler

import de.sambalmueslie.openbooking.common.findByIdOrNull
import de.sambalmueslie.openbooking.core.booking.api.BookingInfo
import de.sambalmueslie.openbooking.core.booking.db.BookingData
import de.sambalmueslie.openbooking.core.booking.db.BookingRepository
import de.sambalmueslie.openbooking.core.offer.api.OfferInfo
import de.sambalmueslie.openbooking.core.offer.assembler.OfferInfoAssembler
import de.sambalmueslie.openbooking.core.visitor.VisitorService
import de.sambalmueslie.openbooking.core.visitor.api.Visitor
import io.micronaut.data.model.Page
import io.micronaut.data.model.Pageable
import jakarta.inject.Singleton
import org.slf4j.LoggerFactory

@Singleton
class BookingInfoAssembler(
    private val repository: BookingRepository,
    private val offerInfoAssembler: OfferInfoAssembler,
    private val visitorService: VisitorService,
) {

    companion object {
        private val logger = LoggerFactory.getLogger(BookingInfoAssembler::class.java)
    }

    fun getAll(pageable: Pageable): Page<BookingInfo> {
        return pageToInfo { repository.findAll(pageable) }
    }

    fun get(id: Long): BookingInfo? {
        return dataToInfo { repository.findByIdOrNull(id) }
    }

    fun getByIds(ids: Set<Long>): List<BookingInfo> {
        return listToInfo { repository.findByIdIn(ids) }
    }

    fun getByOfferId(offerId: Long): List<BookingInfo> {
        return listToInfo { repository.findByOfferId(offerId) }
    }

    fun getByOfferIds(offerIds: Set<Long>): List<BookingInfo> {
        return listToInfo { repository.findByOfferIdIn(offerIds) }
    }

    fun getByKey(key: String): BookingInfo? {
        return dataToInfo { repository.findByKey(key) }
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
        val visitorIds = data.map { it.visitorId }.toSet()
        val visitors = visitorService.getVisitors(visitorIds).associateBy { it.id }

        val offerIds = data.map { it.offerId }.toSet()
        val offers = offerInfoAssembler.getByIds(offerIds).associateBy { it.offer.id }

        return data.mapNotNull { info(it, visitors, offers) }.sortedBy { it.visitor.verification.status.order }
    }

    private fun info(data: BookingData, visitors: Map<Long, Visitor>, offers: Map<Long, OfferInfo>): BookingInfo? {
        val visitor = visitors[data.visitorId] ?: return null
        val offer = offers[data.offerId] ?: return null
        return info(data, visitor, offer)
    }

    private fun info(data: BookingData): BookingInfo? {
        val visitor = visitorService.get(data.visitorId) ?: return null
        val offer = offerInfoAssembler.get(data.offerId) ?: return null
        return info(data, visitor, offer)
    }

    private fun info(data: BookingData, visitor: Visitor, offer: OfferInfo): BookingInfo {
        val timestamp = data.updated ?: data.created
        return BookingInfo(data.id, visitor, offer, data.status, data.comment, data.lang, timestamp)
    }

}