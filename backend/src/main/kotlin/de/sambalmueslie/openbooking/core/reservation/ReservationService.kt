package de.sambalmueslie.openbooking.core.reservation

import de.sambalmueslie.openbooking.common.GenericCrudService
import de.sambalmueslie.openbooking.common.TimeProvider
import de.sambalmueslie.openbooking.common.findByIdOrNull
import de.sambalmueslie.openbooking.core.booking.BookingService
import de.sambalmueslie.openbooking.core.booking.api.Booking
import de.sambalmueslie.openbooking.core.booking.api.BookingStatus
import de.sambalmueslie.openbooking.core.offer.OfferService
import de.sambalmueslie.openbooking.core.offer.api.Offer
import de.sambalmueslie.openbooking.core.reservation.api.Reservation
import de.sambalmueslie.openbooking.core.reservation.api.ReservationChangeRequest
import de.sambalmueslie.openbooking.core.reservation.api.ReservationStatus
import de.sambalmueslie.openbooking.core.reservation.db.ReservationData
import de.sambalmueslie.openbooking.core.reservation.db.ReservationOfferRelation
import de.sambalmueslie.openbooking.core.reservation.db.ReservationOfferRelationRepository
import de.sambalmueslie.openbooking.core.reservation.db.ReservationRepository
import de.sambalmueslie.openbooking.core.visitor.VisitorService
import de.sambalmueslie.openbooking.error.InvalidRequestException
import de.sambalmueslie.openbooking.infrastructure.cache.CacheService
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

}