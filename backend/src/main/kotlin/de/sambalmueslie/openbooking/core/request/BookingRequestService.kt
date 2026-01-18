package de.sambalmueslie.openbooking.core.request


import de.sambalmueslie.openbooking.common.GenericCrudService
import de.sambalmueslie.openbooking.common.GenericRequestResult
import de.sambalmueslie.openbooking.common.TimeProvider
import de.sambalmueslie.openbooking.common.findByIdOrNull
import de.sambalmueslie.openbooking.config.AppConfig
import de.sambalmueslie.openbooking.core.booking.BookingChangeListener
import de.sambalmueslie.openbooking.core.booking.BookingService
import de.sambalmueslie.openbooking.core.booking.api.Booking
import de.sambalmueslie.openbooking.core.booking.api.BookingStatus
import de.sambalmueslie.openbooking.core.offer.OfferService
import de.sambalmueslie.openbooking.core.offer.api.Offer
import de.sambalmueslie.openbooking.core.request.api.*
import de.sambalmueslie.openbooking.core.request.db.BookingRequestData
import de.sambalmueslie.openbooking.core.request.db.BookingRequestRelationRepository
import de.sambalmueslie.openbooking.core.request.db.BookingRequestRepository
import de.sambalmueslie.openbooking.core.visitor.VisitorService
import de.sambalmueslie.openbooking.core.visitor.api.VisitorChangeRequest
import de.sambalmueslie.openbooking.infrastructure.cache.CacheService
import jakarta.inject.Singleton
import org.slf4j.LoggerFactory
import java.util.*


@Singleton
@Deprecated("use reservation instead.", ReplaceWith("reservation"))
class BookingRequestService(
    private val bookingService: BookingService,
    private val visitorService: VisitorService,
    private val offerService: OfferService,
    private val repository: BookingRequestRepository,
    private val relationRepository: BookingRequestRelationRepository,

    private val converter: BookingInfoConverter,
    private val filterService: BookingRequestFilterService,
    private val messageService: BookingRequestMessageService,
    private val changeService: BookingRequestChangeService,

    private val config: AppConfig,
    private val timeProvider: TimeProvider,
    cacheService: CacheService,
) : GenericCrudService<Long, BookingRequest, BookingRequestChangeRequest, BookingRequestChangeListener, BookingRequestData>(repository, cacheService, BookingRequest::class, logger) {

    companion object {
        private val logger = LoggerFactory.getLogger(BookingRequestService::class.java)
        const val MSG_CONFIRM_EMAIL_FAILED = "VISITOR_GROUP.Message.ConfirmEmailFailed"
        const val MSG_CONFIRM_EMAIL_SUCCEED = "VISITOR_GROUP.Message.ConfirmEmailSucceed"
        const val MSG_CONFIRM_REQUEST_FAILED = "REQUEST.MESSAGE.CONFIRM.FAILED"
        const val MSG_CONFIRM_REQUEST_SUCCESS = "REQUEST.MESSAGE.CONFIRM.SUCCESS"
        const val MSG_DENIAL_REQUEST_SUCCESS = "REQUEST.MESSAGE.DENIAL.SUCCESS"
        const val MSG_UPDATE_REQUEST_FAIL = "REQUEST.MESSAGE.UPDATE.FAIL"
        const val MSG_UPDATE_REQUEST_SUCCESS = "REQUEST.MESSAGE.UPDATE.SUCCESS"
    }


    init {
        bookingService.register(object : BookingChangeListener {
            override fun handleDeleted(obj: Booking) {
                relationRepository.deleteByBookingId(obj.id)
            }
        })
    }

    override fun create(request: BookingRequestChangeRequest): BookingRequest {
//        val offerIds = request.offerIds.toSet()
//        val existingBookings = bookingService.getByOfferIds(offerIds).groupBy { it.offerId }
//        val suitableOffers = offerService.getByIds(offerIds).filter {
//            isEnoughSpaceAvailable(request, it, existingBookings[it.id] ?: emptyList())
//        }
//        if (suitableOffers.isEmpty()) throw InvalidRequestException("REQUEST.Error.NoSuitableOffer")
//
//        isValid(request)
//        val data = repository.save(createData(request))
//
//        val bookings = suitableOffers.map { bookingService.create(BookingChangeRequest(it.id, data.visitorId, "")) }
//        val relations = bookings.map { BookingRequestRelation(it.id, data.id) }
//        relationRepository.saveAll(relations)
//
//        val result = data.convert()
//        notifyCreated(result)
//        return result
        TODO("not implemented yet")
    }

    private fun isEnoughSpaceAvailable(request: BookingRequestChangeRequest, offer: Offer, bookings: List<Booking>): Boolean {
        if (bookings.isEmpty()) return true
        if (request.ignoreSizeCheck) return true

        val spaceConfirmed = bookings.filter { it.status == BookingStatus.CONFIRMED || it.status == BookingStatus.PENDING }.sumOf { it.size }
        val spaceAvailable = offer.maxPersons - spaceConfirmed

        return spaceAvailable >= request.visitorChangeRequest.size
    }

    override fun createData(request: BookingRequestChangeRequest): BookingRequestData {
        val visitor = visitorService.create(request.visitorChangeRequest)
        if (request.autoConfirm) {
            visitorService.confirm(visitor.id)
        }

        val key = UUID.randomUUID().toString().uppercase(Locale.getDefault())
        return BookingRequestData(0, key, BookingRequestStatus.UNCONFIRMED, visitor.id, request.comment, timeProvider.now())
    }


    override fun update(id: Long, request: BookingRequestChangeRequest): BookingRequest {
        TODO("Not yet implemented")
    }

    override fun updateData(data: BookingRequestData, request: BookingRequestChangeRequest): BookingRequestData {
        TODO("Not yet implemented")
    }

    override fun isValid(request: BookingRequestChangeRequest) {
        visitorService.isValid(request.visitorChangeRequest)
    }

    override fun deleteDependencies(data: BookingRequestData) {
        val relations = relationRepository.getByBookingRequestId(data.id)
        relations.forEach { bookingService.delete(it.bookingId) }

        visitorService.delete(data.visitorId)

        relationRepository.deleteByBookingRequestId(data.id)
    }


    fun confirm(id: Long, bookingId: Long, content: BookingConfirmationContent): GenericRequestResult {
//        val relations = relationRepository.getByBookingRequestId(id)
//        if (!relations.any { it.bookingId == bookingId }) return GenericRequestResult(false, MSG_CONFIRM_REQUEST_FAILED)
//
//        val result = patchData(id) { it.setStatus(BookingRequestStatus.CONFIRMED, timeProvider.now()) } ?: return GenericRequestResult(false, MSG_CONFIRM_REQUEST_FAILED)
//
//        relations.forEach {
//            if (it.bookingId == bookingId) {
//                bookingService.confirm(it.bookingId)
//            } else {
//                bookingService.denial(it.bookingId)
//            }
//        }
//
//        notify { it.confirmed(result, content) }
//        return GenericRequestResult(true, MSG_CONFIRM_REQUEST_SUCCESS)
        TODO("refactoring")
    }


    fun updateVisitor(id: Long, request: VisitorChangeRequest) = changeService.updateVisitor(id, request)

    fun info(id: Long) = converter.data { repository.findByIdOrNull(id) }

    fun findByOfferId(offerId: Long): List<BookingRequestInfo> {
        val bookings = bookingService.getByOfferId(offerId).associateBy { it.id }
        val relations = relationRepository.getByBookingIdIn(bookings.keys)
        return converter.list { repository.findByIdIn(relations.map { it.bookingRequestId }.toSet()) }
    }

}
