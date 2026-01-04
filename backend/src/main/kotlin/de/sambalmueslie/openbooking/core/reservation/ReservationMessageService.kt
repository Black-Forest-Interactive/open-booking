package de.sambalmueslie.openbooking.core.reservation

import de.sambalmueslie.openbooking.core.reservation.assembler.ReservationInfoAssembler
import de.sambalmueslie.openbooking.core.response.ResponseService
import de.sambalmueslie.openbooking.core.response.api.ResolvedResponse
import de.sambalmueslie.openbooking.core.response.api.ResponseType
import jakarta.inject.Singleton
import org.slf4j.LoggerFactory

@Singleton
class ReservationMessageService(
    private val responseService: ResponseService,
    private val infoAssembler: ReservationInfoAssembler
) {
    companion object {
        private val logger = LoggerFactory.getLogger(ReservationMessageService::class.java)
    }


    fun getRequestReceivedMessage(id: Long, lang: String = "de"): ResolvedResponse? {
        val info = infoAssembler.get(id) ?: return null
        val properties = mutableMapOf(
            Pair("status", info.status),
            Pair("visitor", info.visitor),
            Pair("offer", info.offer),
        )
        return responseService.resolve(lang, ResponseType.RESERVATION_RECEIVED, properties)
    }

    fun getRequestFailedMessage(id: Long, lang: String = "de"): ResolvedResponse? {
        val info = infoAssembler.get(id) ?: return null
        val properties = mutableMapOf(
            Pair("status", info.status),
            Pair("visitor", info.visitor),
            Pair("offer", info.offer),
        )
        return responseService.resolve(lang, ResponseType.RESERVATION_FAILED, properties)
    }

    fun getConfirmationMessage(id: Long, offerId: Long, lang: String = "de"): ResolvedResponse? {
        val info = infoAssembler.get(id) ?: return null
        val selected = info.offer.find { it.offerId == offerId } ?: return null
        val properties = mutableMapOf(
            Pair("status", info.status),
            Pair("visitor", info.visitor),
            Pair("offer", info.offer),
            Pair("selected", selected),
        )
        return responseService.resolve(lang, ResponseType.RESERVATION_CONFIRMED, properties)
    }


    fun getDenialMessage(id: Long, lang: String = "de"): ResolvedResponse? {
        val info = infoAssembler.get(id) ?: return null
        val properties = mutableMapOf(
            Pair("status", info.status),
            Pair("visitor", info.visitor),
            Pair("offer", info.offer),
        )
        return responseService.resolve(lang, ResponseType.RESERVATION_DENIED, properties)
    }
}