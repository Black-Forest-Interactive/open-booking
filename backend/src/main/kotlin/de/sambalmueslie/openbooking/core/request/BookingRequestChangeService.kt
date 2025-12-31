package de.sambalmueslie.openbooking.core.request


import de.sambalmueslie.openbooking.common.GenericRequestResult
import de.sambalmueslie.openbooking.common.findByIdOrNull
import de.sambalmueslie.openbooking.core.booking.BookingService
import de.sambalmueslie.openbooking.core.booking.api.Booking
import de.sambalmueslie.openbooking.core.booking.api.BookingStatus
import de.sambalmueslie.openbooking.core.offer.OfferService
import de.sambalmueslie.openbooking.core.offer.api.Offer
import de.sambalmueslie.openbooking.core.request.db.BookingRequestData
import de.sambalmueslie.openbooking.core.request.db.BookingRequestRelationRepository
import de.sambalmueslie.openbooking.core.request.db.BookingRequestRepository
import de.sambalmueslie.openbooking.core.visitor.VisitorService
import de.sambalmueslie.openbooking.core.visitor.api.Visitor
import de.sambalmueslie.openbooking.core.visitor.api.VisitorChangeRequest
import jakarta.inject.Singleton
import org.slf4j.LoggerFactory

@Singleton
@Deprecated("use reservation instead.", ReplaceWith("reservation"))
class BookingRequestChangeService(
    private val bookingService: BookingService,
    private val visitorService: VisitorService,
    private val offerService: OfferService,
    private val repository: BookingRequestRepository,
    private val relationRepository: BookingRequestRelationRepository,
) {

    companion object {
        private val logger = LoggerFactory.getLogger(BookingRequestChangeService::class.java)
    }

    fun updateVisitor(id: Long, request: VisitorChangeRequest): GenericRequestResult {
        logger.info("Update visitor group for request $id with $request")
        visitorService.isValid(request)

        val data = repository.findByIdOrNull(id)
            ?: return GenericRequestResult(false, BookingRequestService.MSG_UPDATE_REQUEST_FAIL)

        val current = visitorService.get(data.visitorId)
            ?: return GenericRequestResult(false, BookingRequestService.MSG_UPDATE_REQUEST_FAIL)

        val sizeChanged = current.size != request.size
        return if (sizeChanged) {
            updateVisitorWithSizeChange(data, current, request)
        } else {
            updateVisitorWithoutSizeChange(data, request)
        }
    }

    private fun updateVisitorWithSizeChange(data: BookingRequestData, current: Visitor, request: VisitorChangeRequest): GenericRequestResult {
        logger.info("Update visitor group with size change ${data.id} $request")
        val reduceSize = current.size > request.size
        return if (reduceSize) {
            updateVisitorWithReduceSizeChange(data, request)
        } else {
            updateVisitorWithIncreaseSizeChange(data, current, request)
        }
    }

    private fun updateVisitorWithReduceSizeChange(data: BookingRequestData, request: VisitorChangeRequest): GenericRequestResult {
        logger.info("Update visitor group with reduce size change ${data.id} $request")

        val relations = relationRepository.getByBookingRequestId(data.id)
        val bookingIds = relations.map { it.bookingId }.toSet()
        val bookings = bookingService.getBookings(bookingIds)

        val visitor = visitorService.update(data.visitorId, request)
        bookings.forEach { bookingService.update(it.id, visitor, it.status) }
        return GenericRequestResult(true, BookingRequestService.MSG_UPDATE_REQUEST_SUCCESS)
    }

    private fun updateVisitorWithIncreaseSizeChange(data: BookingRequestData, current: Visitor, request: VisitorChangeRequest): GenericRequestResult {
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

        val visitor = visitorService.update(data.visitorId, request)

        requestBookings.forEach { (offerId, bookings) ->
            val offerSuitable = suitableOffers.containsKey(offerId)
            bookings.forEach {
                val status = if (offerSuitable) it.status else BookingStatus.DENIED
                bookingService.update(it.id, visitor, status)
            }
        }
        return GenericRequestResult(true, BookingRequestService.MSG_UPDATE_REQUEST_SUCCESS)
    }

    private fun isEnoughSpaceAvailable(request: VisitorChangeRequest, current: Visitor, offer: Offer, requestBookings: List<Booking>, offerBookings: List<Booking>): Boolean {
        if (offerBookings.isEmpty()) return request.size <= offer.maxPersons

        val spaceConfirmed = offerBookings.filter { it.status == BookingStatus.CONFIRMED || it.status == BookingStatus.UNCONFIRMED }.sumOf { it.size }
        val spaceAvailable = offer.maxPersons - spaceConfirmed

        val additionalSpaceRequired = request.size - current.size
        if (additionalSpaceRequired <= 0) return true

        return spaceAvailable >= additionalSpaceRequired
    }


    private fun updateVisitorWithoutSizeChange(data: BookingRequestData, request: VisitorChangeRequest): GenericRequestResult {
        logger.info("Update visitor group without size change ${data.id} $request")
        visitorService.update(data.visitorId, request)
        return GenericRequestResult(true, BookingRequestService.MSG_UPDATE_REQUEST_SUCCESS)
    }


}
