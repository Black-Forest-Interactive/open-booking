package de.sambalmueslie.openbooking.core.reservation

import de.sambalmueslie.openbooking.common.GenericCrudService
import de.sambalmueslie.openbooking.common.GenericRequestResult
import de.sambalmueslie.openbooking.common.TimeProvider
import de.sambalmueslie.openbooking.common.findByIdOrNull
import de.sambalmueslie.openbooking.core.booking.BookingService
import de.sambalmueslie.openbooking.core.booking.api.Booking
import de.sambalmueslie.openbooking.core.booking.api.BookingStatus
import de.sambalmueslie.openbooking.core.offer.OfferService
import de.sambalmueslie.openbooking.core.offer.api.Offer
import de.sambalmueslie.openbooking.core.request.BookingRequestService.Companion.MSG_CONFIRM_EMAIL_FAILED
import de.sambalmueslie.openbooking.core.request.BookingRequestService.Companion.MSG_CONFIRM_EMAIL_SUCCEED
import de.sambalmueslie.openbooking.core.reservation.api.*
import de.sambalmueslie.openbooking.core.reservation.db.ReservationData
import de.sambalmueslie.openbooking.core.reservation.db.ReservationOfferRelation
import de.sambalmueslie.openbooking.core.reservation.db.ReservationOfferRelationRepository
import de.sambalmueslie.openbooking.core.reservation.db.ReservationRepository
import de.sambalmueslie.openbooking.core.visitor.VisitorService
import de.sambalmueslie.openbooking.core.visitor.api.VerificationStatus
import de.sambalmueslie.openbooking.error.InvalidRequestException
import de.sambalmueslie.openbooking.infrastructure.cache.CacheService
import io.micronaut.data.model.Page
import io.micronaut.data.model.Pageable
import jakarta.inject.Singleton
import org.slf4j.LoggerFactory
import java.util.*

@Singleton
class ReservationService(
    private val repository: ReservationRepository,
    private val relationRepository: ReservationOfferRelationRepository,

    private val bookingService: BookingService,
    private val offerService: OfferService,
    private val visitorService: VisitorService,

    private val messageService: ReservationMessageService,
    private val converter: ReservationConverter,

    private val timeProvider: TimeProvider,
    cacheService: CacheService,
) : GenericCrudService<Long, Reservation, ReservationChangeRequest, ReservationData>(repository, cacheService, Reservation::class, logger) {


    companion object {
        private val logger = LoggerFactory.getLogger(ReservationService::class.java)
    }


    override fun create(request: ReservationChangeRequest): Reservation {
        val suitableOffers = getSuitableOffers(request)
        if (suitableOffers.isEmpty()) throw InvalidRequestException("REQUEST.Error.NoSuitableOffer")

        isValid(request)
        val data = repository.save(createData(request))

        val relations = suitableOffers.sortedBy { request.offerIds.indexOf(it.id) }.mapIndexed { index, offer -> ReservationOfferRelation.create(data, offer.id, index) }
        relationRepository.saveAll(relations)

        val result = data.convert()
        notifyCreated(result)
        return result
    }

    override fun update(id: Long, request: ReservationChangeRequest): Reservation {
        val data = repository.findByIdOrNull(id) ?: return create(request)

        val suitableOffers = getSuitableOffers(request)
        if (suitableOffers.isEmpty()) throw InvalidRequestException("REQUEST.Error.NoSuitableOffer")

        isValid(request)

        relationRepository.deleteByIdReservationId(data.id)

        val relations = suitableOffers.sortedBy { request.offerIds.indexOf(it.id) }.mapIndexed { index, offer -> ReservationOfferRelation.create(data, offer.id, index) }
        relationRepository.saveAll(relations)


        val result = repository.update(updateData(data, request)).convert()
        notifyUpdated(result)
        return result
    }

    private fun getSuitableOffers(request: ReservationChangeRequest): List<Offer> {
        val offerIds = request.offerIds.toSet()
        val existingBookings = bookingService.getBookingsByOfferId(offerIds).groupBy { it.offerId }
        val suitableOffers = offerService.getOffer(offerIds).filter { offer ->
            isSuitable(request, offer, existingBookings[offer.id] ?: emptyList())
        }
        return suitableOffers
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
        return ReservationData(0, key, ReservationStatus.UNCONFIRMED, request.comment, visitor.id, timeProvider.now())
    }

    override fun updateData(data: ReservationData, request: ReservationChangeRequest): ReservationData {
        val visitor = visitorService.update(data.visitorId, request.visitor)
        if (request.autoConfirm) {
            visitorService.confirm(visitor.id)
        }

        return data.update(request, timeProvider.now())
    }

    override fun isValid(request: ReservationChangeRequest) {
        if (request.offerIds.isEmpty()) throw InvalidRequestException("Offer list cannot be empty")
        visitorService.isValid(request.visitor)
    }

    fun getRequestReceivedMessage(id: Long, lang: String = "de") = messageService.getRequestReceivedMessage(id, lang)
    fun getConfirmationMessage(id: Long, offerId: Long, lang: String = "de") = messageService.getConfirmationMessage(id, offerId, lang)
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

    fun getDetails(id: Long): ReservationDetails? {
        return converter.dataToDetails { repository.findByIdOrNull(id) }
    }

    fun getAllDetails(pageable: Pageable): Page<ReservationDetails> {
        return converter.pageToDetails { repository.findAll(pageable) }
    }

    fun getReservations(offer: List<Offer>): List<ReservationDetails> {
        val offerIds = offer.map { it.id }.toSet()
        return converter.relationsToDetails { relationRepository.findByIdOfferIdIn(offerIds) }
    }

    fun getReservationInfoByOfferId(offerId: Long): List<ReservationInfo> {
        return converter.relationsToInfo { relationRepository.findByIdOfferId(offerId) }
    }

    fun getReservationInfoByOfferIds(offerIds: Set<Long>): List<ReservationInfo> {
        return converter.relationsToInfo { relationRepository.findByIdOfferIdIn(offerIds) }
    }

    fun confirm(id: Long, bookingId: Long, content: ReservationConfirmationContent): GenericRequestResult {
//        val relations = relationRepository.getByBookingRequestId(id)
//        if (!relations.any { it.bookingId == bookingId }) return GenericRequestResult(false, MSG_CONFIRM_REQUEST_FAILED)
//
//        val result = patchData(id) { it.setStatus(BookingRequestStatus.CONFIRMED, timeProvider.now()) }
//            ?: return GenericRequestResult(false, MSG_CONFIRM_REQUEST_FAILED)
//
//        relations.forEach {
//            if (it.bookingId == bookingId) {
//                bookingService.confirm(it.bookingId)
//            } else {
//                bookingService.denial(it.bookingId)
//            }
//        }
//
//
//        listeners.forEachWithTryCatch { it.confirmed(result, content) }
//        return GenericRequestResult(true, MSG_CONFIRM_REQUEST_SUCCESS)
        TODO("not implemented yet")
    }

    fun deny(id: Long, content: ReservationConfirmationContent): GenericRequestResult {
//        val result = patchData(id) { it.setStatus(BookingRequestStatus.DENIED, timeProvider.now()) }
//            ?: return GenericRequestResult(false, MSG_CONFIRM_REQUEST_FAILED)
//
//        val relations = relationRepository.getByBookingRequestId(id)
//        relations.forEach { bookingService.denial(it.bookingId) }
//
//        listeners.forEachWithTryCatch { it.denied(result, content) }
//        return GenericRequestResult(true, MSG_DENIAL_REQUEST_SUCCESS)
        TODO("not implemented yet")
    }

}