package de.sambalmueslie.openbooking.core.reservation

import de.sambalmueslie.openbooking.common.GenericCrudService
import de.sambalmueslie.openbooking.common.GenericRequestResult
import de.sambalmueslie.openbooking.common.TimeProvider
import de.sambalmueslie.openbooking.common.findByIdOrNull
import de.sambalmueslie.openbooking.config.AppConfig
import de.sambalmueslie.openbooking.core.booking.BookingService
import de.sambalmueslie.openbooking.core.booking.api.Booking
import de.sambalmueslie.openbooking.core.booking.api.BookingChangeRequest
import de.sambalmueslie.openbooking.core.booking.api.BookingStatus
import de.sambalmueslie.openbooking.core.offer.OfferService
import de.sambalmueslie.openbooking.core.offer.api.Offer
import de.sambalmueslie.openbooking.core.request.BookingRequestService.Companion.MSG_CONFIRM_EMAIL_FAILED
import de.sambalmueslie.openbooking.core.request.BookingRequestService.Companion.MSG_CONFIRM_EMAIL_SUCCEED
import de.sambalmueslie.openbooking.core.request.BookingRequestService.Companion.MSG_CONFIRM_REQUEST_FAILED
import de.sambalmueslie.openbooking.core.request.BookingRequestService.Companion.MSG_CONFIRM_REQUEST_SUCCESS
import de.sambalmueslie.openbooking.core.request.BookingRequestService.Companion.MSG_DENIAL_REQUEST_SUCCESS
import de.sambalmueslie.openbooking.core.reservation.api.Reservation
import de.sambalmueslie.openbooking.core.reservation.api.ReservationChangeRequest
import de.sambalmueslie.openbooking.core.reservation.api.ReservationConfirmationContent
import de.sambalmueslie.openbooking.core.reservation.api.ReservationStatus
import de.sambalmueslie.openbooking.core.reservation.db.ReservationData
import de.sambalmueslie.openbooking.core.reservation.db.ReservationRepository
import de.sambalmueslie.openbooking.core.visitor.VisitorService
import de.sambalmueslie.openbooking.core.visitor.api.VerificationStatus
import de.sambalmueslie.openbooking.error.InvalidRequestException
import de.sambalmueslie.openbooking.infrastructure.cache.CacheService
import jakarta.inject.Singleton
import org.slf4j.LoggerFactory
import java.util.*

@Singleton
class ReservationService(
    private val repository: ReservationRepository,

    private val bookingService: BookingService,
    private val offerService: OfferService,
    private val visitorService: VisitorService,

    private val messageService: ReservationMessageService,

    private val timeProvider: TimeProvider,
    private val config: AppConfig,
    cacheService: CacheService,
) : GenericCrudService<Long, Reservation, ReservationChangeRequest, ReservationChangeListener, ReservationData>(repository, cacheService, Reservation::class, logger) {


    companion object {
        private val logger = LoggerFactory.getLogger(ReservationService::class.java)
    }

    fun getByOffer(offer: List<Offer>): List<Reservation> {
        val offerIds = offer.map { it.id }.toSet()
        return getByOfferIds(offerIds)
    }

    fun getByOfferId(offerId: Long): List<Reservation> {
        return repository.findByOfferId(offerId).map { it.convert() }
    }

    fun getByOfferIds(offerIds: Set<Long>): List<Reservation> {
        return repository.findByOfferIdIn(offerIds).map { it.convert() }
    }

    override fun create(request: ReservationChangeRequest): Reservation {
        val offer = offerService.get(request.offerId) ?: throw InvalidRequestException("REQUEST.Error.InvalidOffer")
        if (!isSuitable(request, offer)) throw InvalidRequestException("REQUEST.Error.NoSuitableOffer")

        isValid(request)
        val data = repository.save(createData(request))

        val result = data.convert()
        notifyCreated(result)
        return result
    }

    override fun update(id: Long, request: ReservationChangeRequest): Reservation {
        val data = repository.findByIdOrNull(id) ?: return create(request)

        isValid(request)

        val offer = offerService.get(request.offerId) ?: throw InvalidRequestException("REQUEST.Error.InvalidOffer")
        if (!isSuitable(request, offer)) throw InvalidRequestException("REQUEST.Error.NoSuitableOffer")

        val result = repository.update(updateData(data, request)).convert()
        notifyUpdated(result)
        return result
    }


    private fun isSuitable(request: ReservationChangeRequest, offer: Offer): Boolean {
        val existingBookings = bookingService.getByOfferId(offer.id)
        return isSuitable(request, offer, existingBookings)
    }

    private fun isSuitable(request: ReservationChangeRequest, offer: Offer, bookings: List<Booking>): Boolean {
        if (bookings.isEmpty()) return true
        if (request.ignoreSizeCheck) return true

        val spaceConfirmed = bookings.filter { it.status == BookingStatus.CONFIRMED || it.status == BookingStatus.UNCONFIRMED }.sumOf { it.size }
        val spaceAvailable = offer.maxPersons - spaceConfirmed

        return spaceAvailable >= request.visitor.size
    }

    override fun createData(request: ReservationChangeRequest): ReservationData {
        val visitor = visitorService.create(request.visitor)
        if (request.autoConfirm) {
            visitorService.confirm(visitor.id)
        }

        val key = UUID.randomUUID().toString().uppercase()
        return ReservationData(0, key, ReservationStatus.UNCONFIRMED, request.comment, visitor.id, request.offerId, null, timeProvider.now())
    }

    override fun updateData(data: ReservationData, request: ReservationChangeRequest): ReservationData {
        val visitor = visitorService.update(data.visitorId, request.visitor)
        if (request.autoConfirm) {
            visitorService.confirm(visitor.id)
        }

        return data.update(request, timeProvider.now())
    }

    override fun isValid(request: ReservationChangeRequest) {
        visitorService.isValid(request.visitor)
    }

    fun getReservationReceivedMessage(id: Long, lang: String = "de") = messageService.getReservationReceivedMessage(id, lang)
    fun getReservationFailedMessage(id: Long, lang: String = "de") = messageService.getReservationFailedMessage(id, lang)
    fun getConfirmationMessage(id: Long, lang: String = "de") = messageService.getConfirmationMessage(id, lang)
    fun getDenialMessage(id: Long, lang: String = "de") = messageService.getDenialMessage(id, lang)


    fun confirmEmail(key: String): GenericRequestResult {
        val request = repository.findByKey(key) ?: return GenericRequestResult(false, MSG_CONFIRM_EMAIL_FAILED)
        val visitorId = request.visitorId
        val visitor = visitorService.confirm(visitorId) ?: return GenericRequestResult(false, MSG_CONFIRM_EMAIL_FAILED)

        return when (visitor.verification.status == VerificationStatus.CONFIRMED) {
            true -> GenericRequestResult(true, MSG_CONFIRM_EMAIL_SUCCEED)
            else -> GenericRequestResult(false, MSG_CONFIRM_EMAIL_FAILED)
        }
    }

    fun confirm(id: Long, content: ReservationConfirmationContent): GenericRequestResult {
        val data = repository.findByIdOrNull(id) ?: return GenericRequestResult(false, MSG_CONFIRM_REQUEST_FAILED)
        if (data.status == ReservationStatus.CONFIRMED) return GenericRequestResult(false, MSG_CONFIRM_REQUEST_FAILED)

        val offer = offerService.get(data.offerId) ?: return GenericRequestResult(false, MSG_CONFIRM_REQUEST_FAILED)

        val booking = bookingService.create(BookingChangeRequest(offer.id, data.visitorId, data.comment))

        val result = patchData(data) {
            it.setBooking(booking, timeProvider.now())
        }

        bookingService.confirm(booking.id)

        notify { it.confirmed(result, content) }
        return GenericRequestResult(true, MSG_CONFIRM_REQUEST_SUCCESS)
    }

    fun deny(id: Long, content: ReservationConfirmationContent): GenericRequestResult {
        val data = repository.findByIdOrNull(id) ?: return GenericRequestResult(false, MSG_CONFIRM_REQUEST_FAILED)
        if (data.status == ReservationStatus.DENIED) return GenericRequestResult(false, MSG_CONFIRM_REQUEST_FAILED)

        val booking = data.bookingId?.let { bookingService.get(it) }
        if (booking != null) {
            bookingService.denial(booking.id)
        }

        val result = patchData(id) { it.setStatus(ReservationStatus.DENIED, timeProvider.now()) }
            ?: return GenericRequestResult(false, MSG_CONFIRM_REQUEST_FAILED)

        notify { it.denied(result, content) }
        return GenericRequestResult(true, MSG_DENIAL_REQUEST_SUCCESS)
    }

    fun getConfirmationUrl(id: Long): String {
        val data = repository.findByIdOrNull(id) ?: return ""
        return "${config.baseUrl}/confirm/email/${data.key}"
    }

    fun getDetailsUrl(id: Long): String {
        val data = repository.findByIdOrNull(id) ?: return ""
        return "${config.baseUrl}/reservation/${data.key}"
    }


}