package de.sambalmueslie.openbooking.gateway.admin.event

import io.micronaut.http.MediaType
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.micronaut.security.authentication.Authentication
import io.swagger.v3.oas.annotations.tags.Tag

@Controller("/api/admin/event")
@Tag(name = "Admin Event API")
class EventController(private val gateway: EventGateway) {

    @Get(value = "/stream", produces = [MediaType.TEXT_EVENT_STREAM])
    fun streamEvents(auth: Authentication) = gateway.streamEvents(auth)

}