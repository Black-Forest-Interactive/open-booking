package de.sambalmueslie.openbooking.core.booking


import de.sambalmueslie.openbooking.common.GenericCrudService
import de.sambalmueslie.openbooking.common.GenericRequestResult
import de.sambalmueslie.openbooking.common.TimeProvider
import de.sambalmueslie.openbooking.common.findByIdOrNull
import de.sambalmueslie.openbooking.core.booking.api.*
import de.sambalmueslie.openbooking.core.booking.db.BookingData
import de.sambalmueslie.openbooking.core.booking.db.BookingRepository
import de.sambalmueslie.openbooking.core.booking.features.BookingConfirmFeature
import de.sambalmueslie.openbooking.core.booking.features.BookingCreateFeature
import de.sambalmueslie.openbooking.core.booking.features.BookingDeclineFeature
import de.sambalmueslie.openbooking.core.booking.features.BookingUpdateFeature
import de.sambalmueslie.openbooking.core.offer.OfferService
import de.sambalmueslie.openbooking.core.offer.api.Offer
import de.sambalmueslie.openbooking.core.visitor.VisitorService
import de.sambalmueslie.openbooking.core.visitor.api.Visitor
import de.sambalmueslie.openbooking.infrastructure.cache.CacheService
import jakarta.inject.Singleton
import org.slf4j.LoggerFactory

@Singleton
class BookingService(
    private val repository: BookingRepository,

    private val offerService: OfferService,
    private val visitorService: VisitorService,

    private val createFeature: BookingCreateFeature,
    private val updateFeature: BookingUpdateFeature,
    private val confirmFeature: BookingConfirmFeature,
    private val declineFeature: BookingDeclineFeature,

    private val timeProvider: TimeProvider,
    cacheService: CacheService,
) : GenericCrudService<Long, Booking, BookingChangeRequest, BookingChangeListener, BookingData>(repository, cacheService, Booking::class, logger) {

    companion object {
        private val logger = LoggerFactory.getLogger(BookingService::class.java)
        const val MSG_CONFIRM_REQUEST_FAILED = "BOOKING.MESSAGE.CONFIRM.FAILED"
        const val MSG_CONFIRM_REQUEST_SUCCESS = "BOOKING.MESSAGE.CONFIRM.SUCCESS"
        const val MSG_DECLINE_REQUEST_FAILED = "BOOKING.MESSAGE.DECLINE.FAILED"
        const val MSG_DECLINE_REQUEST_SUCCESS = "BOOKING.MESSAGE.DECLINE.SUCCESS"
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
        return createFeature.create(request)
    }

    override fun updateData(data: BookingData, request: BookingChangeRequest): BookingData {
        return updateFeature.updateData(data, request)
    }

    override fun isValid(request: BookingChangeRequest) {
        // intentionally left empty
    }

    override fun deleteDependencies(data: BookingData) {
        val amount = repository.countByVisitorId(data.visitorId)
        if (amount <= 1) visitorService.delete(data.visitorId)
    }


    fun confirmEmail(key: String): GenericRequestResult {
        val request = repository.findByKey(key) ?: throw BookingKeyInvalid(key)
        val visitorId = request.visitorId
        return visitorService.confirm(visitorId)
    }

    fun updateComment(id: Long, value: String): Booking? {
        return patchData(id) { it.setComment(value, timeProvider.now()) }
    }

    fun confirm(id: Long, content: BookingConfirmationContent): GenericRequestResult {
        val data = repository.findByIdOrNull(id) ?: return GenericRequestResult(false, MSG_CONFIRM_REQUEST_FAILED)
        val success = confirmFeature.confirm(data, content)
        if (!success) return GenericRequestResult(false, MSG_CONFIRM_REQUEST_FAILED)

        notify { it.confirmed(data.convert(), content) }
        return GenericRequestResult(true, MSG_CONFIRM_REQUEST_SUCCESS)
    }

    fun decline(id: Long, content: BookingConfirmationContent): GenericRequestResult {
        val data = repository.findByIdOrNull(id) ?: return GenericRequestResult(false, MSG_DECLINE_REQUEST_FAILED)
        val success = declineFeature.decline(data, content)
        if (!success) return GenericRequestResult(false, MSG_DECLINE_REQUEST_FAILED)

        notify { it.confirmed(data.convert(), content) }
        return GenericRequestResult(true, MSG_DECLINE_REQUEST_SUCCESS)
    }


    fun update(bookingId: Long, visitor: Visitor, status: BookingStatus) {
        TODO("refactor me")
//        val data = repository.findByIdOrNull(bookingId) ?: return
//        val result = repository.update(data.update(visitor, status, timeProvider.now())).convert()
//        notifyUpdated(result)
    }


}
