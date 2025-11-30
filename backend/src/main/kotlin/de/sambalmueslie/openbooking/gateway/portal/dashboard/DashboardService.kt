package de.sambalmueslie.openbooking.gateway.portal.dashboard

import de.sambalmueslie.openbooking.core.info.InfoService
import de.sambalmueslie.openbooking.core.info.api.DateRangeSelectionRequest
import de.sambalmueslie.openbooking.core.info.api.DayInfo
import de.sambalmueslie.openbooking.core.offer.OfferService
import jakarta.inject.Singleton
import org.slf4j.LoggerFactory
import java.time.LocalDate

@Singleton
class DashboardService(
    private val offerService: OfferService,
    private val infoService: InfoService,
) {
    companion object {
        private val logger = LoggerFactory.getLogger(DashboardService::class.java)
        private const val DEFAULT_DAY_INFO_AMOUNT = 99L
    }

    fun getDefaultDayInfo(): List<DayInfo> {
        val first = offerService.getFirstOffer(LocalDate.now()) ?: return emptyList()
        val from = first.start.toLocalDate()
        val to = from.plusDays(DEFAULT_DAY_INFO_AMOUNT)
        return infoService.getDayInfoRange(DateRangeSelectionRequest(from, to))
    }

    fun selectDayInfo(request: DashboardEntrySearchRequest): List<DayInfo> {
        if (request.from == null || request.to == null) return getDefaultDayInfo()
        val r = DateRangeSelectionRequest(
            request.from,
            request.to
        )
        return infoService.getDayInfoRange(r)
    }

    fun getDayInfo(date: LocalDate): DayInfo? {
        return infoService.getDayInfo(date)
    }

}