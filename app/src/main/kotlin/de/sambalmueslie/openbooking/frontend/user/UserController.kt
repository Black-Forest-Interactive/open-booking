package de.sambalmueslie.openbooking.frontend.user


import de.sambalmueslie.openbooking.backend.info.api.DateRangeSelectionRequest
import de.sambalmueslie.openbooking.frontend.user.api.CreateBookingRequest
import de.sambalmueslie.openbooking.frontend.user.api.OfferInfoSelectRequest
import de.sambalmueslie.openbooking.frontend.user.api.TextResponse
import de.sambalmueslie.openbooking.frontend.user.api.UrlResponse
import de.sambalmueslie.openbooking.frontend.user.logic.UserService
import io.micronaut.http.annotation.*
import io.micronaut.security.annotation.Secured
import io.micronaut.security.rules.SecurityRule
import java.time.LocalDate

@Controller("/api/frontend/user")
@Secured(SecurityRule.IS_ANONYMOUS)
class UserController(private val service: UserService) {

    @Get("/day/info")
    fun getDefaultDayInfo() = service.getDefaultDayInfo()

    @Post("/day/info")
    fun selectDayInfo(@Body request: DateRangeSelectionRequest) = service.selectDayInfo(request)

    @Get("/day/info/{date}")
    fun getDayInfo(@PathVariable date: LocalDate) = service.getDayInfo(date)

    @Post("/offer/info")
    fun getOfferInfo(@Body request: OfferInfoSelectRequest) = service.getOfferInfo(request)

    @Post("/booking")
    fun createBooking(@Body request: CreateBookingRequest) = service.createBooking(request)

    @Get("/offer/{offerId}")
    fun getOffer(@PathVariable offerId: Long) = service.getOffer(offerId)

    @Get("/request/{requestId}/received/message")
    fun getRequestReceivedMessage(@PathVariable requestId: Long, @QueryValue(defaultValue = "en") lang: String) =
        service.getRequestReceivedMessage(requestId, lang)

    @Get("setting/help")
    fun getHelpUrl() = UrlResponse(service.getHelpUrl())

    @Get("setting/terms-and-conditions")
    fun getTermsAndConditionsUrl() = UrlResponse(service.getTermsAndConditionsUrl())

    @Get("setting/title")
    fun getTitle() = TextResponse(service.getTitle())

    @Post("confirm/email/{key}")
    fun confirmEmail(key: String) = service.confirmEmail(key)
}
