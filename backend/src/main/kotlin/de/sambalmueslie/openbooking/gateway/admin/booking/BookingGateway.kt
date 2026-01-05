package de.sambalmueslie.openbooking.gateway.admin.booking

import de.sambalmueslie.openbooking.common.checkPermission
import de.sambalmueslie.openbooking.core.booking.BookingService
import de.sambalmueslie.openbooking.core.booking.api.BookingChangeRequest
import de.sambalmueslie.openbooking.gateway.admin.PERMISSION_BOOKING_ADMIN
import io.micronaut.data.model.Pageable
import io.micronaut.security.authentication.Authentication
import jakarta.inject.Singleton

@Singleton
class BookingGateway(private val service: BookingService) {

    fun getAll(auth: Authentication, pageable: Pageable) = auth.checkPermission(PERMISSION_BOOKING_ADMIN) { service.getAll(pageable) }
    fun get(auth: Authentication, id: Long) = auth.checkPermission(PERMISSION_BOOKING_ADMIN) { service.get(id) }

    fun create(auth: Authentication, request: BookingChangeRequest) = auth.checkPermission(PERMISSION_BOOKING_ADMIN) { service.create(request) }
    fun update(auth: Authentication, id: Long, request: BookingChangeRequest) = auth.checkPermission(PERMISSION_BOOKING_ADMIN) { service.update(id, request) }
    fun delete(auth: Authentication, id: Long) = auth.checkPermission(PERMISSION_BOOKING_ADMIN) { service.delete(id) }

    fun findByOffer(auth: Authentication, offerId: Long) = auth.checkPermission(PERMISSION_BOOKING_ADMIN) { service.findByOffer(offerId) }
    fun findDetailsByOffer(auth: Authentication, offerId: Long) = auth.checkPermission(PERMISSION_BOOKING_ADMIN) { service.findDetailsByOffer(offerId) }
}