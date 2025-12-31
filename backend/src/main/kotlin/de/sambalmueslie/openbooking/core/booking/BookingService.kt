package de.sambalmueslie.openbooking.core.booking


import de.sambalmueslie.openbooking.common.*
import de.sambalmueslie.openbooking.core.booking.api.*
import de.sambalmueslie.openbooking.core.booking.db.BookingData
import de.sambalmueslie.openbooking.core.booking.db.BookingRepository
import de.sambalmueslie.openbooking.core.offer.OfferService
import de.sambalmueslie.openbooking.core.offer.api.Offer
import de.sambalmueslie.openbooking.core.visitor.VisitorService
import de.sambalmueslie.openbooking.core.visitor.api.Visitor
import de.sambalmueslie.openbooking.error.InvalidRequestException
import de.sambalmueslie.openbooking.infrastructure.cache.CacheService
import io.micronaut.data.model.Page
import io.micronaut.data.model.Pageable
import jakarta.inject.Singleton
import org.slf4j.LoggerFactory
import java.util.*

@Singleton
class BookingService(
    private val offerService: OfferService,
    private val visitorService: VisitorService,
    private val repository: BookingRepository,
    private val timeProvider: TimeProvider,
    cacheService: CacheService,
) : GenericCrudService<Long, Booking, BookingChangeRequest, BookingData>(repository, cacheService, Booking::class, logger) {

    companion object {
        private val logger = LoggerFactory.getLogger(BookingService::class.java)
    }

    init {
        offerService.register(object : BusinessObjectChangeListener<Long, Offer> {
            override fun handleDeleted(obj: Offer) {
                val sequence = PageableSequence { repository.findByOfferId(obj.id, it) }
                sequence.forEach { delete(it) }
            }
        })

        visitorService.register(object : BusinessObjectChangeListener<Long, Visitor> {

            override fun handleCreated(obj: Visitor) {
                handleVisitorChanged(obj)
            }

            override fun handleUpdated(obj: Visitor) {
                handleVisitorChanged(obj)
            }

            override fun handleDeleted(obj: Visitor) {
                val sequence = PageableSequence { repository.findByVisitorId(obj.id, it) }
                sequence.forEach { delete(it) }
            }
        })
    }

    private fun handleVisitorChanged(visitor: Visitor) {
        val sequence = PageableSequence { repository.findByVisitorId(visitor.id, it) }
        sequence.forEach {
            if (it.size != visitor.size) patchData(it) { data -> data.update(visitor, timeProvider.now()) }
        }
    }

    override fun createData(request: BookingChangeRequest): BookingData {
        val visitor = visitorService.get(request.visitorId)!!
        val offer = offerService.get(request.offerId)!!

        val key = UUID.randomUUID().toString().uppercase()
        return BookingData(0, key, BookingStatus.UNCONFIRMED, visitor.size, request.comment, offer.id, visitor.id, timeProvider.now())
    }

    override fun updateData(data: BookingData, request: BookingChangeRequest): BookingData {
        val visitor = visitorService.get(request.visitorId)!!
        return data.update(request, visitor, timeProvider.now())
    }

    override fun isValid(request: BookingChangeRequest) {
        if (offerService.get(request.offerId) == null) throw InvalidRequestException("Cannot find offer (${request.offerId}) for booking")
        if (visitorService.get(request.visitorId) == null) throw InvalidRequestException("Cannot find visitor group (${request.visitorId}) for booking")
    }

    fun getBookings(offer: List<Offer>): List<Booking> {
        val offerIds = offer.map { it.id }.toSet()
        return getBookingsByOfferId(offerIds)
    }

    fun getBookings(offer: Offer): List<Booking> {
        return repository.findByOfferId(offer.id).map { it.convert() }
    }

    fun getBookingsByOfferId(offerIds: Set<Long>): List<Booking> {
        return repository.findByOfferIdIn(offerIds).map { it.convert() }
    }

    fun getBookings(bookingIds: Set<Long>): List<Booking> {
        return repository.findByIdIn(bookingIds).map { it.convert() }
    }

    fun getBookingInfos(bookingIds: Set<Long>): List<BookingInfo> {
        val data = repository.findByIdIn(bookingIds)
        val offerIds = data.map { it.offerId }.toSet()
        val offer = offerService.getOffer(offerIds).associateBy { it.id }
        val confirmedBookings = repository.findByOfferIdInAndStatus(offerIds, BookingStatus.CONFIRMED).groupBy { it.offerId }
        return data.mapNotNull { info(it, offer[it.offerId], confirmedBookings[it.offerId] ?: emptyList()) }
    }


    private fun info(data: BookingData, offer: Offer?, confirmedBookings: List<BookingData>): BookingInfo? {
        if (offer == null) return null
        val spaceConfirmed = confirmedBookings.sumOf { visitorService.get(it.visitorId)?.size ?: 0 }
        val spaceAvailable = (offer.maxPersons - spaceConfirmed).coerceAtLeast(0)

        val timestamp = data.updated ?: data.created
        return BookingInfo(data.id, offer, spaceAvailable, spaceConfirmed, data.status, timestamp)
    }

    override fun deleteDependencies(data: BookingData) {
        val amount = repository.countByVisitorId(data.visitorId)
        if (amount <= 1) visitorService.delete(data.visitorId)
    }

    fun confirm(bookingId: Long) {
        val data = repository.findByIdOrNull(bookingId) ?: return
        val result = repository.update(data.update(BookingStatus.CONFIRMED, timeProvider.now())).convert()
        notifyUpdated(result)
    }

    fun denial(bookingId: Long) {
        val data = repository.findByIdOrNull(bookingId) ?: return
        val result = repository.update(data.update(BookingStatus.DENIED, timeProvider.now())).convert()
        notifyUpdated(result)
    }

    fun update(bookingId: Long, visitor: Visitor, status: BookingStatus) {
        val data = repository.findByIdOrNull(bookingId) ?: return
        val result = repository.update(data.update(visitor, status, timeProvider.now())).convert()
        notifyUpdated(result)
    }

    fun findByOffer(offerId: Long): List<Booking> {
        return repository.findByOfferId(offerId).map { it.convert() }
    }

    fun findDetailsByOffer(offerId: Long): List<BookingDetails> {
        val data = repository.findByOfferId(offerId)
        val visitorIds = data.map { it.visitorId }.toSet()
        val visitors = visitorService.getVisitors(visitorIds).associateBy { it.id }

        return data.mapNotNull { detail(it, visitors[it.visitorId]) }
    }

    private fun detail(data: BookingData, visitor: Visitor?): BookingDetails? {
        if (visitor == null) return null
        return BookingDetails(data.convert(), visitor)
    }

    fun searchDetails(request: BookingSearchRequest, pageable: Pageable): Page<BookingSearchResult> {
        val query = "%${request.query}%"
        val page = repository.search(query, pageable)
        val visitorIds = page.content.map { it.visitorId }.toSet()
        val visitors = visitorService.getVisitors(visitorIds).associateBy { it.id }
        val offerIds = page.content.map { it.offerId }.toSet()
        val offers = offerService.getOffer(offerIds).associateBy { it.id }

        return page.map { BookingSearchResult(offers[it.offerId]!!, it.convert(), visitors[it.visitorId]!!) }
    }

}
