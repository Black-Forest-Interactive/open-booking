package de.sambalmueslie.openbooking.backend.request


import de.sambalmueslie.openbooking.backend.booking.BookingService
import de.sambalmueslie.openbooking.backend.booking.api.Booking
import de.sambalmueslie.openbooking.backend.booking.api.BookingStatus
import de.sambalmueslie.openbooking.backend.group.VisitorGroupService
import de.sambalmueslie.openbooking.backend.group.api.VisitorGroup
import de.sambalmueslie.openbooking.backend.group.api.VisitorGroupChangeRequest
import de.sambalmueslie.openbooking.backend.offer.OfferService
import de.sambalmueslie.openbooking.backend.offer.api.Offer
import de.sambalmueslie.openbooking.backend.request.db.BookingRequestData
import de.sambalmueslie.openbooking.backend.request.db.BookingRequestRelationRepository
import de.sambalmueslie.openbooking.backend.request.db.BookingRequestRepository
import de.sambalmueslie.openbooking.common.GenericRequestResult
import de.sambalmueslie.openbooking.common.findByIdOrNull
import jakarta.inject.Singleton
import org.slf4j.Logger
import org.slf4j.LoggerFactory

@Singleton
class BookingRequestChangeService(
    private val bookingService: BookingService,
    private val visitorGroupService: VisitorGroupService,
    private val offerService: OfferService,
    private val repository: BookingRequestRepository,
    private val relationRepository: BookingRequestRelationRepository,
) {

    companion object {
        private val logger: Logger = LoggerFactory.getLogger(BookingRequestChangeService::class.java)
    }

    fun updateVisitorGroup(id: Long, request: VisitorGroupChangeRequest): GenericRequestResult {
        logger.info("Update visitor group for request $id with $request")
        visitorGroupService.isValid(request)

        val data = repository.findByIdOrNull(id)
            ?: return GenericRequestResult(false, BookingRequestService.MSG_UPDATE_REQUEST_FAIL)

        val current = visitorGroupService.get(data.visitorGroupId)
            ?: return GenericRequestResult(false, BookingRequestService.MSG_UPDATE_REQUEST_FAIL)

        val sizeChanged = current.size != request.size
        return if (sizeChanged) {
            updateVisitorGroupWithSizeChange(data, current, request)
        } else {
            updateVisitorGroupWithoutSizeChange(data, request)
        }
    }

    private fun updateVisitorGroupWithSizeChange(data: BookingRequestData, current: VisitorGroup, request: VisitorGroupChangeRequest): GenericRequestResult {
        logger.info("Update visitor group with size change ${data.id} $request")
        val reduceSize = current.size > request.size
        return if (reduceSize) {
            updateVisitorGroupWithReduceSizeChange(data, request)
        } else {
            updateVisitorGroupWithIncreaseSizeChange(data, current, request)
        }
    }

    private fun updateVisitorGroupWithReduceSizeChange(data: BookingRequestData, request: VisitorGroupChangeRequest): GenericRequestResult {
        logger.info("Update visitor group with reduce size change ${data.id} $request")

        val relations = relationRepository.getByBookingRequestId(data.id)
        val bookingIds = relations.map { it.bookingId }.toSet()
        val bookings = bookingService.getBookings(bookingIds)

        val visitorGroup = visitorGroupService.update(data.visitorGroupId, request)
        bookings.forEach { bookingService.update(it.id, visitorGroup, it.status) }
        return GenericRequestResult(true, BookingRequestService.MSG_UPDATE_REQUEST_SUCCESS)
    }

    private fun updateVisitorGroupWithIncreaseSizeChange(data: BookingRequestData, current: VisitorGroup, request: VisitorGroupChangeRequest): GenericRequestResult {
        logger.info("Update visitor group with increase size change ${data.id} $request")

        val relations = relationRepository.getByBookingRequestId(data.id)
        val bookingIds = relations.map { it.bookingId }.toSet()
        val requestBookings = bookingService.getBookings(bookingIds).groupBy { it.offerId }

        val offerIds = requestBookings.keys
        val offerBookings = bookingService.getBookingsByOfferId(offerIds).groupBy { it.offerId }
        val suitableOffers = offerService.getOffer(offerIds)
            .filter {
                isEnoughSpaceAvailable(request, current, it, requestBookings[it.id] ?: emptyList(), offerBookings[it.id] ?: emptyList())
            }
            .associateBy { it.id }
        if (suitableOffers.isEmpty()) return GenericRequestResult(false, "REQUEST.Error.NoSuitableOffer")

        val visitorGroup = visitorGroupService.update(data.visitorGroupId, request)

        requestBookings.forEach { (offerId, bookings) ->
            val offerSuitable = suitableOffers.containsKey(offerId)
            bookings.forEach {
                val status = if (offerSuitable) it.status else BookingStatus.DENIED
                bookingService.update(it.id, visitorGroup, status)
            }
        }
        return GenericRequestResult(true, BookingRequestService.MSG_UPDATE_REQUEST_SUCCESS)
    }

    private fun isEnoughSpaceAvailable(request: VisitorGroupChangeRequest, current: VisitorGroup, offer: Offer, requestBookings: List<Booking>, offerBookings: List<Booking>): Boolean {
        if (offerBookings.isEmpty()) return request.size <= offer.maxPersons

        val spaceConfirmed = offerBookings.filter { it.status == BookingStatus.CONFIRMED || it.status == BookingStatus.UNCONFIRMED }.sumOf { it.size }
        val spaceAvailable = offer.maxPersons - spaceConfirmed

        val additionalSpaceRequired = request.size - current.size
        if (additionalSpaceRequired <= 0) return true

        return spaceAvailable >= additionalSpaceRequired
    }


    private fun updateVisitorGroupWithoutSizeChange(data: BookingRequestData, request: VisitorGroupChangeRequest): GenericRequestResult {
        logger.info("Update visitor group without size change ${data.id} $request")
        visitorGroupService.update(data.visitorGroupId, request)
        return GenericRequestResult(true, BookingRequestService.MSG_UPDATE_REQUEST_SUCCESS)
    }


}
