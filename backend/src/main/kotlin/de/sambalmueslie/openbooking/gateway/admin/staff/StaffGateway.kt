package de.sambalmueslie.openbooking.gateway.admin.staff

import de.sambalmueslie.openbooking.common.checkPermission
import de.sambalmueslie.openbooking.core.staff.StaffService
import de.sambalmueslie.openbooking.core.staff.api.StaffMemberChangeRequest
import de.sambalmueslie.openbooking.gateway.admin.PERMISSION_STAFF_ADMIN
import io.micronaut.data.model.Pageable
import io.micronaut.security.authentication.Authentication
import jakarta.inject.Singleton

@Singleton
class StaffGateway(private val service: StaffService) {
    fun get(auth: Authentication, id: Long) = auth.checkPermission(PERMISSION_STAFF_ADMIN) {
        service.get(id)
    }

    fun getAll(auth: Authentication, pageable: Pageable) = auth.checkPermission(PERMISSION_STAFF_ADMIN) {
        service.getAll(pageable)
    }

    fun create(auth: Authentication, request: StaffMemberChangeRequest) = auth.checkPermission(PERMISSION_STAFF_ADMIN) {
        service.create(request)
    }

    fun update(auth: Authentication, id: Long, request: StaffMemberChangeRequest) = auth.checkPermission(PERMISSION_STAFF_ADMIN) {
        service.update(id, request)
    }

    fun delete(auth: Authentication, id: Long) = auth.checkPermission(PERMISSION_STAFF_ADMIN) {
        service.delete(id)
    }
}