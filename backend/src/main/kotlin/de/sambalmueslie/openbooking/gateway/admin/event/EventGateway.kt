package de.sambalmueslie.openbooking.gateway.admin.event

import de.sambalmueslie.openbooking.common.checkPermission
import de.sambalmueslie.openbooking.gateway.admin.PERMISSION_EVENT_ADMIN
import de.sambalmueslie.openbooking.infrastructure.event.EventService
import io.micronaut.security.authentication.Authentication
import jakarta.inject.Singleton

@Singleton
class EventGateway(
    private val service: EventService
) {
    fun streamEvents(auth: Authentication) = auth.checkPermission(PERMISSION_EVENT_ADMIN) { service.subscribe() }
}