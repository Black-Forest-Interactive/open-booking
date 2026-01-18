package de.sambalmueslie.openbooking.core.booking.assembler

import de.sambalmueslie.openbooking.common.findByIdOrNull
import de.sambalmueslie.openbooking.core.booking.api.Booking
import de.sambalmueslie.openbooking.core.booking.api.BookingDetails
import de.sambalmueslie.openbooking.core.booking.db.BookingData
import de.sambalmueslie.openbooking.core.booking.db.BookingRepository
import de.sambalmueslie.openbooking.core.editor.EditorService
import de.sambalmueslie.openbooking.core.offer.api.OfferReference
import de.sambalmueslie.openbooking.core.offer.assembler.OfferReferenceAssembler
import de.sambalmueslie.openbooking.core.visitor.VisitorService
import de.sambalmueslie.openbooking.core.visitor.api.Visitor
import io.micronaut.data.model.Page
import io.micronaut.data.model.Pageable
import jakarta.inject.Singleton
import org.slf4j.LoggerFactory

@Singleton
class BookingDetailsAssembler(
    private val repository: BookingRepository,
    private val editorService: EditorService,
    private val offerService: OfferReferenceAssembler,
    private val visitorService: VisitorService
) {
    companion object {
        private val logger = LoggerFactory.getLogger(BookingDetailsAssembler::class.java)
    }


    fun getAll(pageable: Pageable): Page<BookingDetails> {
        return pageToDetails { repository.findAll(pageable) }
    }

    fun get(id: Long): BookingDetails? {
        return dataToDetails { repository.findByIdOrNull(id) }
    }

    fun getByIds(ids: Set<Long>): List<BookingDetails> {
        return listToDetails { repository.findByIdIn(ids) }
    }

    fun getByOfferId(offerId: Long): List<BookingDetails> {
        return listToDetails { repository.findByOfferId(offerId) }
    }

    fun getByOfferIds(offerIds: Set<Long>): List<BookingDetails> {
        return listToDetails { repository.findByOfferIdIn(offerIds) }
    }

    fun getByKey(key: String): BookingDetails? {
        return dataToDetails { repository.findByKey(key) }
    }

    fun getByVisitorId(visitorId: Long): List<BookingDetails> {
        return listToDetails { repository.findByVisitorId(visitorId) }
    }

    fun getByVisitorIdIn(visitorIds: Set<Long>): List<BookingDetails> {
        return listToDetails { repository.findByVisitorIdIn(visitorIds) }
    }


    private fun pageToDetails(provider: () -> Page<BookingData>): Page<BookingDetails> {
        return details(provider.invoke())
    }

    private fun listToDetails(provider: () -> List<BookingData>): List<BookingDetails> {
        return details(provider.invoke())
    }

    private fun dataToDetails(provider: () -> BookingData?): BookingDetails? {
        val data = provider.invoke() ?: return null
        return details(data)
    }

    private fun details(data: Page<BookingData>): Page<BookingDetails> {
        val result = details(data.content)
        return Page.of(result, data.pageable, data.totalSize)
    }

    private fun details(data: List<BookingData>): List<BookingDetails> {
        val offerIds = data.map { it.offerId }.toSet()
        val offers = offerService.getByIds(offerIds).associateBy { it.offer.id }
        return details(data, offers)
    }

    private fun details(data: List<BookingData>, offers: Map<Long, OfferReference>): List<BookingDetails> {
        val visitorIds = data.map { it.visitorId }.toSet()
        val visitors = visitorService.getVisitors(visitorIds).associateBy { it.id }

        return data.mapNotNull { details(it, visitors, offers) }.sortedBy { it.visitor.verification.status.order }
    }

    private fun details(data: BookingData, visitors: Map<Long, Visitor>, offers: Map<Long, OfferReference>): BookingDetails? {
        val visitor = visitors[data.visitorId] ?: return null
        return details(data, visitor, offers)
    }

    private fun details(data: BookingData): BookingDetails? {
        val visitor = visitorService.get(data.visitorId) ?: return null
        val offer = offerService.get(data.offerId) ?: return null
        return details(data, visitor, offer)
    }

    private fun details(data: BookingData, visitor: Visitor, offers: Map<Long, OfferReference>): BookingDetails? {
        val offer = offers[data.offerId] ?: return null
        return details(data, visitor, offer)
    }

    private fun details(data: BookingData, visitor: Visitor, offer: OfferReference): BookingDetails {
        val timestamp = data.updated ?: data.created
        return BookingDetails(data.convert(), visitor, offer, timestamp, editorService.getByResource(data.id, Booking::class).firstOrNull())
    }
}