package de.sambalmueslie.openbooking.gateway.admin.reservation

import io.micronaut.http.annotation.Controller
import io.swagger.v3.oas.annotations.tags.Tag

@Controller("/api/admin/reservation")
@Tag(name = "Admin Reservation API")
class ReservationController(private val gateway: ReservationGateway)