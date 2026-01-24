package de.sambalmueslie.openbooking.core.booking

import de.sambalmueslie.openbooking.core.booking.api.BookingChangeRequest
import de.sambalmueslie.openbooking.core.booking.assembler.BookingInfoAssembler
import de.sambalmueslie.openbooking.core.response.ResponseService
import de.sambalmueslie.openbooking.core.response.api.ResolvedResponse
import de.sambalmueslie.openbooking.core.response.api.ResponseType
import jakarta.inject.Singleton
import org.slf4j.LoggerFactory

@Singleton
class BookingResponseService(
    private val responseService: ResponseService,
    private val infoAssembler: BookingInfoAssembler
) {
    companion object {
        private val logger = LoggerFactory.getLogger(BookingResponseService::class.java)
    }

    fun getReceivedResponse(id: Long, lang: String = "de"): ResolvedResponse? {
        val info = infoAssembler.get(id) ?: return null
        val properties = mutableMapOf(
            Pair("status", info.status),
            Pair("visitor", info.visitor),
            Pair("offer", info.offer),
        )
        return responseService.resolve(lang, ResponseType.BOOKING_RECEIVED, properties)
    }

    fun getFailedResponse(request: BookingChangeRequest, lang: String = "de"): ResolvedResponse? {
        val properties: MutableMap<String, Any> = mutableMapOf(
            Pair("request", request),
        )
        return responseService.resolve(lang, ResponseType.BOOKING_FAILED, properties)
    }

    fun getConfirmResponse(id: Long, lang: String = "de"): ResolvedResponse? {
        val info = infoAssembler.get(id) ?: return null
        val properties = mutableMapOf(
            Pair("status", info.status),
            Pair("visitor", info.visitor),
            Pair("offer", info.offer),
        )
        return responseService.resolve(lang, ResponseType.BOOKING_CONFIRM, properties)
    }

    fun getDeclineResponse(id: Long, lang: String = "de"): ResolvedResponse? {
        val info = infoAssembler.get(id) ?: return null
        val properties = mutableMapOf(
            Pair("status", info.status),
            Pair("visitor", info.visitor),
            Pair("offer", info.offer),
        )
        return responseService.resolve(lang, ResponseType.BOOKING_DECLINE, properties)
    }
}