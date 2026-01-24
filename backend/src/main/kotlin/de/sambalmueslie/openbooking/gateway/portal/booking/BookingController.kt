package de.sambalmueslie.openbooking.gateway.portal.booking

import de.sambalmueslie.openbooking.common.PatchRequest
import de.sambalmueslie.openbooking.core.visitor.api.VisitorResizeRequest
import io.micronaut.http.annotation.*
import io.micronaut.security.annotation.Secured
import io.micronaut.security.rules.SecurityRule
import io.micronaut.session.Session
import io.swagger.v3.oas.annotations.tags.Tag

@Controller("/api/portal/booking")
@Tag(name = "Booking API")
@Secured(SecurityRule.IS_ANONYMOUS)
class BookingController(private val gateway: BookingGateway) {
    @Post()
    fun create(session: Session, @Body request: CreateBookingRequest, @QueryValue(defaultValue = "en") lang: String) = gateway.create(session, request, lang)

    @Post("confirm/email")
    fun confirmEmail(@QueryValue key: String) = gateway.confirmEmail(key)

    @Put("comment")
    fun updateComment(@QueryValue key: String, @Body value: PatchRequest<String>) = gateway.updateComment(key, value)

    @Put("size")
    fun updateSize(@QueryValue key: String, @Body value: VisitorResizeRequest) = gateway.updateSize(key, value)

    @Put("phone")
    fun updatePhone(@QueryValue key: String, @Body value: PatchRequest<String>) = gateway.updatePhone(key, value)

    @Put("email")
    fun updateEmail(@QueryValue key: String, @Body value: PatchRequest<String>) = gateway.updateEmail(key, value)

    @Get()
    fun get(@QueryValue key: String) = gateway.get(key)

    @Delete()
    fun cancel(@QueryValue key: String) = gateway.cancel(key)

}