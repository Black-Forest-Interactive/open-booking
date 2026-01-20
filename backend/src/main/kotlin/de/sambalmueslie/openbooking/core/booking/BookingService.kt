package de.sambalmueslie.openbooking.core.booking


import de.sambalmueslie.openbooking.common.GenericCrudService
import de.sambalmueslie.openbooking.common.GenericRequestResult
import de.sambalmueslie.openbooking.common.TimeProvider
import de.sambalmueslie.openbooking.common.findByIdOrNull
import de.sambalmueslie.openbooking.config.AppConfig
import de.sambalmueslie.openbooking.core.booking.api.*
import de.sambalmueslie.openbooking.core.booking.db.BookingData
import de.sambalmueslie.openbooking.core.booking.db.BookingRepository
import de.sambalmueslie.openbooking.core.booking.features.BookingCancelFeature
import de.sambalmueslie.openbooking.core.booking.features.BookingChangeFeature
import de.sambalmueslie.openbooking.core.booking.features.BookingConfirmFeature
import de.sambalmueslie.openbooking.core.booking.features.BookingDeclineFeature
import de.sambalmueslie.openbooking.core.offer.api.Offer
import de.sambalmueslie.openbooking.core.visitor.VisitorService
import de.sambalmueslie.openbooking.core.visitor.api.Visitor
import de.sambalmueslie.openbooking.infrastructure.cache.CacheService
import jakarta.inject.Singleton
import org.slf4j.LoggerFactory

@Singleton
class BookingService(
    private val repository: BookingRepository,

    private val visitorService: VisitorService,

    private val changeFeature: BookingChangeFeature,
    private val confirmFeature: BookingConfirmFeature,
    private val declineFeature: BookingDeclineFeature,
    private val cancelFeature: BookingCancelFeature,

    private val config: AppConfig,
    private val timeProvider: TimeProvider,
    cacheService: CacheService,
) : GenericCrudService<Long, Booking, BookingChangeRequest, BookingChangeListener, BookingData>(repository, cacheService, Booking::class, logger) {

    companion object {
        private val logger = LoggerFactory.getLogger(BookingService::class.java)
        const val MSG_CONFIRM_REQUEST_FAILED = "BOOKING.MESSAGE.CONFIRM.FAILED"
        const val MSG_CONFIRM_REQUEST_SUCCESS = "BOOKING.MESSAGE.CONFIRM.SUCCESS"
        const val MSG_DECLINE_REQUEST_FAILED = "BOOKING.MESSAGE.DECLINE.FAILED"
        const val MSG_DECLINE_REQUEST_SUCCESS = "BOOKING.MESSAGE.DECLINE.SUCCESS"
        const val MSG_CANCEL_REQUEST_FAILED = "BOOKING.MESSAGE.CANCEL.FAILED"
        const val MSG_CANCEL_REQUEST_SUCCESS = "BOOKING.MESSAGE.CANCEL.SUCCESS"
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
        return changeFeature.create(request)
    }

    override fun updateData(data: BookingData, request: BookingChangeRequest): BookingData {
        return changeFeature.update(data, request)
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

    fun updateComment(key: String, value: String): Booking? {
        val data = repository.findByKey(key) ?: return null
        return patchData(data) { it.setComment(value, timeProvider.now()) }
    }

    fun updateSize(id: Long, request: BookingResizeRequest): Booking? {
        return patchData(id) { changeFeature.updateSize(it, request) }
    }

    fun updateSize(key: String, request: BookingResizeRequest): Booking? {
        val data = repository.findByKey(key) ?: return null
        return patchData(data) { changeFeature.updateSize(it, request) }
    }

    fun updatePhone(key: String, value: String): Booking? {
        val data = repository.findByKey(key) ?: return null
        visitorService.updatePhone(data.visitorId, value)
        return data.convert()
    }

    fun updateEmail(key: String, value: String): Booking? {
        val data = repository.findByKey(key) ?: return null
        visitorService.updateEmail(data.visitorId, value) ?: return null
        return data.convert()
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

    fun cancel(id: Long): GenericRequestResult {
        return cancel() { repository.findByIdOrNull(id) }
    }

    fun cancel(key: String): GenericRequestResult {
        return cancel() { repository.findByKey(key) }
    }

    private fun cancel(provider: () -> BookingData?): GenericRequestResult {
        val data = provider.invoke() ?: return GenericRequestResult(false, MSG_CANCEL_REQUEST_FAILED)
        val success = cancelFeature.cancel(data)
        if (!success) return GenericRequestResult(false, MSG_CANCEL_REQUEST_FAILED)

        notify { it.canceled(data.convert()) }
        return GenericRequestResult(true, MSG_CANCEL_REQUEST_SUCCESS)
    }

    fun getConfirmationUrl(id: Long): String {
        val data = repository.findByIdOrNull(id) ?: return ""
        return "${config.baseUrl}/confirm/email/${data.key}"
    }

    fun getDetailsUrl(id: Long): String {
        val data = repository.findByIdOrNull(id) ?: return ""
        return "${config.baseUrl}/reservation/${data.key}"
    }

    fun update(bookingId: Long, visitor: Visitor, status: BookingStatus) {
        TODO("refactor me")
//        val data = repository.findByIdOrNull(bookingId) ?: return
//        val result = repository.update(data.update(visitor, status, timeProvider.now())).convert()
//        notifyUpdated(result)
    }


}
