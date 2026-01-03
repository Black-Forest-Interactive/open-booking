package de.sambalmueslie.openbooking.gateway.admin.reservation

import de.sambalmueslie.openbooking.common.checkPermission
import de.sambalmueslie.openbooking.core.reservation.ReservationService
import de.sambalmueslie.openbooking.core.reservation.api.ReservationChangeRequest
import de.sambalmueslie.openbooking.core.search.reservation.ReservationSearchOperator
import de.sambalmueslie.openbooking.core.search.reservation.api.ReservationSearchRequest
import de.sambalmueslie.openbooking.gateway.admin.PERMISSION_RESERVATION_ADMIN
import io.micronaut.data.model.Pageable
import io.micronaut.security.authentication.Authentication
import jakarta.inject.Singleton

@Singleton
class ReservationGateway(
    private val service: ReservationService,
    private val searchOperator: ReservationSearchOperator,
) {
    fun getAll(auth: Authentication, pageable: Pageable) = auth.checkPermission(PERMISSION_RESERVATION_ADMIN) { service.getAll(pageable) }
    fun get(auth: Authentication, id: Long) = auth.checkPermission(PERMISSION_RESERVATION_ADMIN) { service.get(id) }
    fun search(auth: Authentication, request: ReservationSearchRequest, pageable: Pageable) = auth.checkPermission(PERMISSION_RESERVATION_ADMIN) { searchOperator.search(request, pageable) }

    fun create(auth: Authentication, request: ReservationChangeRequest) = auth.checkPermission(PERMISSION_RESERVATION_ADMIN) { service.create(request) }
    fun update(auth: Authentication, id: Long, request: ReservationChangeRequest) = auth.checkPermission(PERMISSION_RESERVATION_ADMIN) { service.update(id, request) }
    fun delete(auth: Authentication, id: Long) = auth.checkPermission(PERMISSION_RESERVATION_ADMIN) { service.delete(id) }
}