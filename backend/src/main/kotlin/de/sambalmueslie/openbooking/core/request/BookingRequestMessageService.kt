package de.sambalmueslie.openbooking.core.request


import de.sambalmueslie.openbooking.core.request.db.BookingRequestRepository
import de.sambalmueslie.openbooking.core.response.ResponseService
import de.sambalmueslie.openbooking.core.response.api.ResolvedResponse
import de.sambalmueslie.openbooking.core.response.api.ResponseType
import de.sambalmueslie.openbooking.common.findByIdOrNull
import jakarta.inject.Singleton
import org.slf4j.Logger
import org.slf4j.LoggerFactory

@Singleton
class BookingRequestMessageService(
    private val responseService: ResponseService,
    private val repository: BookingRequestRepository,
    private val converter: BookingInfoConverter,
) {

    companion object {
        private val logger: Logger = LoggerFactory.getLogger(BookingRequestMessageService::class.java)
    }

    fun getRequestReceivedMessage(id: Long, lang: String = "de"): ResolvedResponse? {
        val info = converter.data { repository.findByIdOrNull(id) } ?: return null
        val properties = mutableMapOf(
            Pair("status", info.status),
            Pair("visitor", info.visitorGroup),
            Pair("bookings", info.bookings),
        )
        return responseService.resolve(lang, ResponseType.BOOKING_REQUEST_RECEIVED, properties)
    }

    fun getConfirmationMessage(id: Long, bookingId: Long, lang: String = "de"): ResolvedResponse? {
        val info = converter.data { repository.findByIdOrNull(id) } ?: return null
        val selected = info.bookings.find { it.id == bookingId } ?: return null
        val properties = mutableMapOf(
            Pair("status", info.status),
            Pair("visitor", info.visitorGroup),
            Pair("bookings", info.bookings),
            Pair("selected", selected),
        )
        return responseService.resolve(lang, ResponseType.BOOKING_CONFIRMED, properties)
    }


    fun getDenialMessage(id: Long, lang: String = "de"): ResolvedResponse? {
        val info = converter.data { repository.findByIdOrNull(id) } ?: return null
        val properties = mutableMapOf(
            Pair("status", info.status),
            Pair("visitor", info.visitorGroup),
            Pair("bookings", info.bookings),
        )
        return responseService.resolve(lang, ResponseType.BOOKING_DENIED, properties)
    }

}
