package de.sambalmueslie.openbooking.core.booking


import de.sambalmueslie.openbooking.core.booking.api.*
import de.sambalmueslie.openbooking.core.booking.db.BookingData
import de.sambalmueslie.openbooking.core.booking.db.BookingRepository
import de.sambalmueslie.openbooking.core.cache.CacheService
import de.sambalmueslie.openbooking.core.group.VisitorGroupService
import de.sambalmueslie.openbooking.core.group.api.VisitorGroup
import de.sambalmueslie.openbooking.core.offer.OfferService
import de.sambalmueslie.openbooking.core.offer.api.Offer
import de.sambalmueslie.openbooking.common.*
import de.sambalmueslie.openbooking.error.InvalidRequestException
import io.micronaut.data.model.Page
import io.micronaut.data.model.Pageable
import jakarta.inject.Singleton
import org.slf4j.Logger
import org.slf4j.LoggerFactory

@Singleton
class BookingService(
    private val offerService: OfferService,
    private val visitorGroupService: VisitorGroupService,
    private val repository: BookingRepository,
    private val timeProvider: TimeProvider,
    cacheService: CacheService,
) : GenericCrudService<Long, Booking, BookingChangeRequest, BookingData>(repository, cacheService, Booking::class, logger) {

    companion object {
        private val logger: Logger = LoggerFactory.getLogger(BookingService::class.java)
    }

    init {
        offerService.register(object : BusinessObjectChangeListener<Long, Offer> {
            override fun handleDeleted(obj: Offer) {
                val sequence = PageableSequence() { repository.findByOfferId(obj.id, it) }
                sequence.forEach { delete(it) }
            }
        })

        visitorGroupService.register(object : BusinessObjectChangeListener<Long, VisitorGroup> {

            override fun handleCreated(obj: VisitorGroup) {
                handleVisitorGroupChanged(obj)
            }

            override fun handleUpdated(obj: VisitorGroup) {
                handleVisitorGroupChanged(obj)
            }

            override fun handleDeleted(obj: VisitorGroup) {
                val sequence = PageableSequence() { repository.findByVisitorGroupId(obj.id, it) }
                sequence.forEach { delete(it) }
            }
        })
    }

    private fun handleVisitorGroupChanged(visitorGroup: VisitorGroup) {
        val sequence = PageableSequence() { repository.findByVisitorGroupId(visitorGroup.id, it) }
        sequence.forEach {
            if (it.size != visitorGroup.size) patchData(it) { data -> data.update(visitorGroup, timeProvider.now()) }
        }
    }

    override fun createData(request: BookingChangeRequest): BookingData {
        val visitorGroup = visitorGroupService.get(request.visitorGroupId)!!
        return BookingData.create(request, visitorGroup, timeProvider.now())
    }

    override fun updateData(data: BookingData, request: BookingChangeRequest): BookingData {
        val visitorGroup = visitorGroupService.get(request.visitorGroupId)!!
        return data.update(request, visitorGroup, timeProvider.now())
    }

    override fun isValid(request: BookingChangeRequest) {
        if (offerService.get(request.offerId) == null) throw InvalidRequestException("Cannot find offer (${request.offerId}) for booking")
        if (visitorGroupService.get(request.visitorGroupId) == null) throw InvalidRequestException("Cannot find visitor group (${request.visitorGroupId}) for booking")
    }

    fun getBookings(offer: List<Offer>): List<Booking> {
        val offerIds = offer.map { it.id }.toSet()
        return getBookingsByOfferId(offerIds)
    }

    fun getBookings(offer: Offer): List<Booking> {
        return repository.findByOfferId(offer.id).map { it.convert() }
    }

    fun getBookingsByOfferId(offerIds: Set<Long>): List<Booking>{
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
        val spaceConfirmed = confirmedBookings.sumOf { visitorGroupService.get(it.visitorGroupId)?.size ?: 0 }
        val spaceAvailable = (offer.maxPersons - spaceConfirmed).coerceAtLeast(0)

        val timestamp = data.updated ?: data.created
        return BookingInfo(data.id, offer, spaceAvailable, spaceConfirmed, data.status, timestamp)
    }

    override fun deleteDependencies(data: BookingData) {
        val amount = repository.countByVisitorGroupId(data.visitorGroupId)
        if (amount <= 1) visitorGroupService.delete(data.visitorGroupId)
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

    fun update(bookingId: Long, visitorGroup: VisitorGroup, status: BookingStatus){
        val data = repository.findByIdOrNull(bookingId) ?: return
        val result = repository.update(data.update(visitorGroup, status, timeProvider.now())).convert()
        notifyUpdated(result)
    }

    fun findByOffer(offerId: Long): List<Booking> {
        return repository.findByOfferId(offerId).map { it.convert() }
    }

    fun findDetailsByOffer(offerId: Long): List<BookingDetails> {
        val data = repository.findByOfferId(offerId)
        val visitorGroupIds = data.map { it.visitorGroupId }.toSet()
        val visitorGroups = visitorGroupService.getVisitorGroups(visitorGroupIds).associateBy { it.id }

        return data.mapNotNull { detail(it, visitorGroups[it.visitorGroupId]) }
    }

    private fun detail(data: BookingData, visitorGroup: VisitorGroup?): BookingDetails? {
        if (visitorGroup == null) return null
        return BookingDetails(data.convert(), visitorGroup)
    }

    fun searchDetails(request: BookingSearchRequest, pageable: Pageable): Page<BookingSearchResult> {
        val query = "%${request.query}%"
        val page = repository.search(query, pageable)
        val visitorGroupIds = page.content.map { it.visitorGroupId }.toSet()
        val visitorGroups = visitorGroupService.getVisitorGroups(visitorGroupIds).associateBy { it.id }
        val offerIds = page.content.map { it.offerId }.toSet()
        val offers = offerService.getOffer(offerIds).associateBy { it.id }

        return page.map { BookingSearchResult(offers[it.offerId]!!, it.convert(), visitorGroups[it.visitorGroupId]!!) }
    }

}
