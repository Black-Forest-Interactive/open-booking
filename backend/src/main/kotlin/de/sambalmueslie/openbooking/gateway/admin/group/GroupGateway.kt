package de.sambalmueslie.openbooking.gateway.admin.group

import de.sambalmueslie.openbooking.common.checkPermission
import de.sambalmueslie.openbooking.core.visitor.VisitorService
import de.sambalmueslie.openbooking.core.visitor.api.VisitorChangeRequest
import de.sambalmueslie.openbooking.gateway.admin.PERMISSION_GROUP_ADMIN
import io.micronaut.data.model.Pageable
import io.micronaut.security.authentication.Authentication
import jakarta.inject.Singleton

@Singleton
class GroupGateway(private val service: VisitorService) {
    fun get(auth: Authentication, id: Long) = auth.checkPermission(PERMISSION_GROUP_ADMIN) {
        service.get(id)
    }

    fun getAll(auth: Authentication, pageable: Pageable) = auth.checkPermission(PERMISSION_GROUP_ADMIN) {
        service.getAll(pageable)
    }

    fun create(auth: Authentication, request: VisitorChangeRequest) = auth.checkPermission(PERMISSION_GROUP_ADMIN) {
        service.create(request)
    }

    fun update(auth: Authentication, id: Long, request: VisitorChangeRequest) = auth.checkPermission(PERMISSION_GROUP_ADMIN) {
        service.update(id, request)
    }

    fun delete(auth: Authentication, id: Long) = auth.checkPermission(PERMISSION_GROUP_ADMIN) {
        service.delete(id)
    }

    fun confirm(auth: Authentication, id: Long) = auth.checkPermission(PERMISSION_GROUP_ADMIN) {
        service.confirm(id)
    }
}