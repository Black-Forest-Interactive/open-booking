package de.sambalmueslie.openbooking.gateway.admin.reservation

import de.sambalmueslie.openbooking.core.reservation.ReservationService
import jakarta.inject.Singleton

@Singleton
class ReservationGateway(private val service: ReservationService)