package de.sambalmueslie.openbooking.gateway.admin.role

import de.sambalmueslie.openbooking.common.checkPermission
import de.sambalmueslie.openbooking.core.role.RoleService
import de.sambalmueslie.openbooking.core.role.api.TourRoleChangeRequest
import de.sambalmueslie.openbooking.gateway.admin.PERMISSION_ROLE_ADMIN
import io.micronaut.data.model.Pageable
import io.micronaut.security.authentication.Authentication
import jakarta.inject.Singleton

@Singleton
class RoleGateway(private val service: RoleService) {
    fun get(auth: Authentication, id: Long) = auth.checkPermission(PERMISSION_ROLE_ADMIN) {
        service.get(id)
    }

    fun getAll(auth: Authentication, pageable: Pageable) = auth.checkPermission(PERMISSION_ROLE_ADMIN) {
        service.getAll(pageable)
    }

    fun create(auth: Authentication, request: TourRoleChangeRequest) = auth.checkPermission(PERMISSION_ROLE_ADMIN) {
        service.create(request)
    }

    fun update(auth: Authentication, id: Long, request: TourRoleChangeRequest) = auth.checkPermission(PERMISSION_ROLE_ADMIN) {
        service.update(id, request)
    }

    fun delete(auth: Authentication, id: Long) = auth.checkPermission(PERMISSION_ROLE_ADMIN) {
        service.delete(id)
    }
}