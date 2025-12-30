package de.sambalmueslie.openbooking.frontend.user.logic


import com.fasterxml.jackson.databind.ObjectMapper
import de.sambalmueslie.openbooking.common.GenericRequestResult
import de.sambalmueslie.openbooking.core.booking.api.BookingStatus
import de.sambalmueslie.openbooking.core.info.InfoService
import de.sambalmueslie.openbooking.core.info.api.DateRangeSelectionRequest
import de.sambalmueslie.openbooking.core.info.api.DayInfo
import de.sambalmueslie.openbooking.core.info.api.DayInfoOffer
import de.sambalmueslie.openbooking.core.offer.OfferService
import de.sambalmueslie.openbooking.core.request.BookingRequestService
import de.sambalmueslie.openbooking.core.request.api.BookingRequest
import de.sambalmueslie.openbooking.core.request.api.BookingRequestChangeRequest
import de.sambalmueslie.openbooking.core.response.api.ResolvedResponse
import de.sambalmueslie.openbooking.core.settings.SettingsService
import de.sambalmueslie.openbooking.core.settings.api.SettingsAPI
import de.sambalmueslie.openbooking.error.InvalidRequestException
import de.sambalmueslie.openbooking.frontend.user.api.CreateBookingRequest
import de.sambalmueslie.openbooking.frontend.user.api.OfferInfoSelectRequest
import de.sambalmueslie.openbooking.frontend.user.api.OfferInfoSelectResultEntry
import jakarta.inject.Singleton
import org.slf4j.LoggerFactory
import java.time.LocalDate

@Singleton
class UserService(
    private val offerService: OfferService,
    private val bookingRequestService: BookingRequestService,
    private val infoService: InfoService,
    private val settingsService: SettingsService,
    private val mapper: ObjectMapper
) {
    companion object {
        private val logger = LoggerFactory.getLogger(UserService::class.java)
        private const val DEFAULT_DAY_INFO_AMOUNT = 99L
    }

    fun getDefaultDayInfo(): List<DayInfo> {
        val first = offerService.getFirstOffer(LocalDate.now()) ?: return emptyList()
        val from = first.start.toLocalDate()
        val to = from.plusDays(DEFAULT_DAY_INFO_AMOUNT)
        return infoService.getDayInfoRange(DateRangeSelectionRequest(from, to))
    }

    fun selectDayInfo(request: DateRangeSelectionRequest): List<DayInfo> {
        return infoService.getDayInfoRange(request)
    }

    fun getDayInfo(date: LocalDate): DayInfo? {
        return infoService.getDayInfo(date)
    }


    fun getOfferInfo(request: OfferInfoSelectRequest): List<OfferInfoSelectResultEntry> {
        val dayInfos = request.dates.associateWith { infoService.getDayInfo(it) }

        return dayInfos.mapNotNull { (date, info) ->
            if (info == null) {
                null
            } else {
                val offer = info.offer.filter { isSpaceAvailable(it, request) }
                OfferInfoSelectResultEntry(date, offer)
            }
        }
    }

    private fun isSpaceAvailable(offer: DayInfoOffer, request: OfferInfoSelectRequest): Boolean {
        val confirmedSpace = offer.space[BookingStatus.CONFIRMED] ?: 0
        val totalSpace = offer.offer.maxPersons
        val availableSpace = totalSpace - confirmedSpace
        return availableSpace >= request.groupSize
    }

    fun createBooking(request: CreateBookingRequest): BookingRequest {
        if (!request.termsAndConditions) throw InvalidRequestException("You must accept the terms and conditions")
        if (logger.isDebugEnabled) logger.debug("Create booking ${mapper.writeValueAsString(request)}")
        return bookingRequestService.create(BookingRequestChangeRequest(request.visitorChangeRequest, request.offerIds, request.comment, false, false))
    }

    fun getOffer(offerId: Long): DayInfoOffer? {
        val offer = offerService.get(offerId) ?: return null
        val date = offer.start.toLocalDate()
        val dayInfo = infoService.getDayInfo(date) ?: return null

        return dayInfo.offer.find { it.offer.id == offer.id }
    }


    fun getHelpUrl(): String {
        return settingsService.findByKey(SettingsAPI.SETTINGS_URL_HELP)?.value as? String ?: ""
    }

    fun getTermsAndConditionsUrl(): String {
        return settingsService.findByKey(SettingsAPI.SETTINGS_URL_TERMS_AND_CONDITIONS)?.value as? String ?: ""
    }

    fun confirmEmail(key: String): GenericRequestResult {
        return bookingRequestService.confirmEmail(key)
    }

    fun getRequestReceivedMessage(requestId: Long, lang: String): ResolvedResponse? {
        return bookingRequestService.getRequestReceivedMessage(requestId, lang)
    }

    fun getTitle(): String {
        return settingsService.findByKey(SettingsAPI.SETTINGS_TEXT_TITLE)?.value as? String ?: ""
    }

}
