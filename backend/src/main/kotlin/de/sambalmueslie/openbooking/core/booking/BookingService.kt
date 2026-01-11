package de.sambalmueslie.openbooking.core.booking


import de.sambalmueslie.openbooking.common.GenericCrudService
import de.sambalmueslie.openbooking.common.PageableSequence
import de.sambalmueslie.openbooking.common.TimeProvider
import de.sambalmueslie.openbooking.common.findByIdOrNull
import de.sambalmueslie.openbooking.core.booking.api.Booking
import de.sambalmueslie.openbooking.core.booking.api.BookingChangeRequest
import de.sambalmueslie.openbooking.core.booking.api.BookingDetails
import de.sambalmueslie.openbooking.core.booking.api.BookingStatus
import de.sambalmueslie.openbooking.core.booking.db.BookingData
import de.sambalmueslie.openbooking.core.booking.db.BookingRepository
import de.sambalmueslie.openbooking.core.offer.OfferChangeListener
import de.sambalmueslie.openbooking.core.offer.OfferService
import de.sambalmueslie.openbooking.core.offer.api.Offer
import de.sambalmueslie.openbooking.core.visitor.VisitorChangeListener
import de.sambalmueslie.openbooking.core.visitor.VisitorService
import de.sambalmueslie.openbooking.core.visitor.api.Visitor
import de.sambalmueslie.openbooking.error.InvalidRequestException
import de.sambalmueslie.openbooking.infrastructure.cache.CacheService
import jakarta.inject.Singleton
import org.slf4j.LoggerFactory
import java.util.*

@Singleton
class BookingService(
    private val repository: BookingRepository,

    private val offerService: OfferService,
    private val visitorService: VisitorService,

    private val timeProvider: TimeProvider,
    cacheService: CacheService,
) : GenericCrudService<Long, Booking, BookingChangeRequest, BookingChangeListener, BookingData>(repository, cacheService, Booking::class, logger) {

    companion object {
        private val logger = LoggerFactory.getLogger(BookingService::class.java)
    }

    init {
        offerService.register(object : OfferChangeListener {
            override fun handleDeleted(obj: Offer) {
                val sequence = PageableSequence { repository.findByOfferId(obj.id, it) }
                sequence.forEach { delete(it) }
            }
        })

        visitorService.register(object : VisitorChangeListener {

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


    fun getByIds(ids: Set<Long>): List<Booking> {
        return repository.findByIdIn(ids).map { it.convert() }
    }

    fun getByOffer(offer: List<Offer>): List<Booking> {
        val offerIds = offer.map { it.id }.toSet()
        return getByOfferIds(offerIds)
    }

    fun getByOfferId(offerId: Long): List<Booking> {
        return repository.findByOfferId(offerId).map { it.convert() }
    }

    fun getByOfferIds(offerIds: Set<Long>): List<Booking> {
        return repository.findByOfferIdIn(offerIds).map { it.convert() }
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


}
