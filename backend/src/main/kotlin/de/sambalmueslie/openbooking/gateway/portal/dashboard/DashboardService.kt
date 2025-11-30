package de.sambalmueslie.openbooking.gateway.portal.dashboard

import de.sambalmueslie.openbooking.core.booking.api.BookingStatus
import de.sambalmueslie.openbooking.core.info.InfoService
import de.sambalmueslie.openbooking.core.info.api.DateRangeSelectionRequest
import de.sambalmueslie.openbooking.core.info.api.DayInfo
import de.sambalmueslie.openbooking.core.info.api.DayInfoOffer
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

    fun getDefaultDayInfo(): List<DashboardEntry> {
        val first = offerService.getFirstOffer(LocalDate.now()) ?: return emptyList()
        val from = first.start.toLocalDate()
        val to = from.plusDays(DEFAULT_DAY_INFO_AMOUNT)
        return infoService.getDayInfoRange(DateRangeSelectionRequest(from, to)).map { convert(it) }
    }

    fun search(request: DashboardEntrySearchRequest): List<DashboardEntry> {
        if (request.from == null || request.to == null) return getDefaultDayInfo()
        val r = DateRangeSelectionRequest(
            request.from,
            request.to
        )
        return infoService.getDayInfoRange(r).map { convert(it) }
    }

    private fun convert(info: DayInfo): DashboardEntry {
        return DashboardEntry(
            info.date,
            info.start,
            info.end,
            info.offer.map { convert(it) }
        )
    }

    private fun convert(info: DayInfoOffer): DashboardEntryOffer {
        return DashboardEntryOffer(
            info.offer.start,
            info.getSpaceAvailable(),
            info.getSpaceConfirmed(),
            info.getSpaceUnconfirmed(),
            info.getSpaceDeactivated()
        )
    }

    private fun DayInfoOffer.getSpaceAvailable(): Int {
        val confirmed = space[BookingStatus.CONFIRMED] ?: 0
        val unconfirmed = space[BookingStatus.UNCONFIRMED] ?: 0
        val result = if (offer.active) offer.maxPersons - confirmed - unconfirmed else 0
        if (result < 0) return 0
        if (result > offer.maxPersons) return offer.maxPersons
        return result
    }

    private fun DayInfoOffer.getSpaceConfirmed(): Int {
        val confirmed = space[BookingStatus.CONFIRMED] ?: 0
        val result = if (offer.active) confirmed else 0
        if (result < 0) return 0
        if (result > offer.maxPersons) return offer.maxPersons
        return result
    }

    private fun DayInfoOffer.getSpaceUnconfirmed(): Int {
        val unconfirmed = space[BookingStatus.UNCONFIRMED] ?: 0
        val result = if (offer.active) unconfirmed else 0
        if (result < 0) return 0
        if (result > offer.maxPersons) return offer.maxPersons
        return result
    }

    private fun DayInfoOffer.getSpaceDeactivated(): Int {
        return if (offer.active) 0 else offer.maxPersons
    }

    fun getDayInfo(date: LocalDate): DayInfo? {
        return infoService.getDayInfo(date)
    }

}