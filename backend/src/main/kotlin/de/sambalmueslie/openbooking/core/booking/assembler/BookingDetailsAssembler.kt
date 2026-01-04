package de.sambalmueslie.openbooking.core.booking.assembler

import de.sambalmueslie.openbooking.common.findByIdOrNull
import de.sambalmueslie.openbooking.core.booking.api.BookingDetails
import de.sambalmueslie.openbooking.core.booking.db.BookingData
import de.sambalmueslie.openbooking.core.booking.db.BookingRepository
import de.sambalmueslie.openbooking.core.visitor.VisitorService
import de.sambalmueslie.openbooking.core.visitor.api.Visitor
import io.micronaut.data.model.Page
import io.micronaut.data.model.Pageable
import jakarta.inject.Singleton
import org.slf4j.LoggerFactory

@Singleton
class BookingDetailsAssembler(
    private val repository: BookingRepository,
    private val visitorService: VisitorService
) {
    companion object {
        private val logger = LoggerFactory.getLogger(BookingDetailsAssembler::class.java)
    }


    fun getAllDetails(pageable: Pageable): Page<BookingDetails> {
        return pageToDetails { repository.findAll(pageable) }
    }

    fun getDetail(id: Long): BookingDetails? {
        return dataToDetails { repository.findByIdOrNull(id) }
    }

    fun getDetailByIds(ids: Set<Long>): List<BookingDetails> {
        return listToDetails { repository.findByIdIn(ids) }
    }

    fun getDetailByOfferId(offerId: Long): List<BookingDetails> {
        return listToDetails { repository.findByOfferId(offerId) }
    }

    fun getDetailByOfferIds(offerIds: Set<Long>): List<BookingDetails> {
        return listToDetails { repository.findByOfferIdIn(offerIds) }
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
        val visitorIds = data.map { it.visitorId }.toSet()
        val visitors = visitorService.getVisitors(visitorIds).associateBy { it.id }

        return data.mapNotNull { details(it, visitors) }
    }

    private fun details(data: BookingData, visitors: Map<Long, Visitor>): BookingDetails? {
        val visitor = visitors[data.visitorId] ?: return null

        return details(data, visitor)
    }

    private fun details(data: BookingData): BookingDetails? {
        val visitor = visitorService.get(data.visitorId) ?: return null
        return details(data, visitor)
    }

    private fun details(data: BookingData, visitor: Visitor): BookingDetails {
        return BookingDetails(data.convert(), visitor)
    }
}