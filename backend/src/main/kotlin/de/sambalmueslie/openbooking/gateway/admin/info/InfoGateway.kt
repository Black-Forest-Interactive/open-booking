package de.sambalmueslie.openbooking.gateway.admin.info

import de.sambalmueslie.openbooking.common.checkPermission
import de.sambalmueslie.openbooking.core.info.InfoService
import de.sambalmueslie.openbooking.core.info.api.DateRangeSelectionRequest
import de.sambalmueslie.openbooking.core.info.api.DayInfo
import de.sambalmueslie.openbooking.core.offer.OfferService
import de.sambalmueslie.openbooking.gateway.admin.PERMISSION_INFO_ADMIN
import io.micronaut.security.authentication.Authentication
import jakarta.inject.Singleton
import org.slf4j.LoggerFactory
import java.time.LocalDate

@Singleton
class InfoGateway(
    private val service: InfoService,
    private val offerService: OfferService,
) {

    companion object {
        private val logger = LoggerFactory.getLogger(InfoGateway::class.java)
        private const val DEFAULT_DAY_INFO_AMOUNT = 99L
    }

    fun getDayInfo(auth: Authentication, date: LocalDate) = auth.checkPermission(PERMISSION_INFO_ADMIN) { service.getDayInfo(date) }

    fun getDayInfoRange(auth: Authentication, request: DayInfoRangeRequest) = auth.checkPermission(PERMISSION_INFO_ADMIN) {
        if (request.from == null || request.to == null) return@checkPermission getDefaultDayInfo()
        val r = DateRangeSelectionRequest(
            request.from,
            request.to
        )
        service.getDayInfoRange(r)
    }

    fun getDefaultDayInfo(): List<DayInfo> {
        val first = offerService.getFirstOffer(LocalDate.now()) ?: return emptyList()
        val from = first.start.toLocalDate()
        val to = from.plusDays(DEFAULT_DAY_INFO_AMOUNT)
        return service.getDayInfoRange(DateRangeSelectionRequest(from, to))
    }
}