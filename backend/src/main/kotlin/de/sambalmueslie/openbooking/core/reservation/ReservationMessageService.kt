package de.sambalmueslie.openbooking.core.reservation

import de.sambalmueslie.openbooking.common.findByIdOrNull
import de.sambalmueslie.openbooking.core.reservation.db.ReservationRepository
import de.sambalmueslie.openbooking.core.response.ResponseService
import de.sambalmueslie.openbooking.core.response.api.ResolvedResponse
import de.sambalmueslie.openbooking.core.response.api.ResponseType
import jakarta.inject.Singleton
import org.slf4j.LoggerFactory

@Singleton
class ReservationMessageService(
    private val responseService: ResponseService,
    private val repository: ReservationRepository,
    private val converter: ReservationInfoConverter
) {
    companion object {
        private val logger = LoggerFactory.getLogger(ReservationMessageService::class.java)
    }


    fun getRequestReceivedMessage(id: Long, lang: String = "de"): ResolvedResponse? {
        val info = converter.data { repository.findByIdOrNull(id) } ?: return null
        val properties = mutableMapOf(
            Pair("status", info.status),
            Pair("visitor", info.visitor),
            Pair("offer", info.offer),
        )
        return responseService.resolve(lang, ResponseType.RESERVATION_RECEIVED, properties)
    }

    fun getRequestFailedMessage(id: Long, lang: String = "de"): ResolvedResponse? {
        val info = converter.data { repository.findByIdOrNull(id) } ?: return null
        val properties = mutableMapOf(
            Pair("status", info.status),
            Pair("visitor", info.visitor),
            Pair("offer", info.offer),
        )
        return responseService.resolve(lang, ResponseType.RESERVATION_FAILED, properties)
    }
}