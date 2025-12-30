package de.sambalmueslie.openbooking.gateway.admin.guide

import de.sambalmueslie.openbooking.common.checkPermission
import de.sambalmueslie.openbooking.core.guide.GuideService
import de.sambalmueslie.openbooking.core.guide.api.GuideChangeRequest
import de.sambalmueslie.openbooking.gateway.admin.PERMISSION_GUIDE_ADMIN
import io.micronaut.data.model.Pageable
import io.micronaut.security.authentication.Authentication
import jakarta.inject.Singleton

@Singleton
class GuideGateway(private val service: GuideService) {
    fun get(auth: Authentication, id: Long) = auth.checkPermission(PERMISSION_GUIDE_ADMIN) {
        service.get(id)
    }

    fun getAll(auth: Authentication, pageable: Pageable) = auth.checkPermission(PERMISSION_GUIDE_ADMIN) {
        service.getAll(pageable)
    }

    fun create(auth: Authentication, request: GuideChangeRequest) = auth.checkPermission(PERMISSION_GUIDE_ADMIN) {
        service.create(request)
    }

    fun update(auth: Authentication, id: Long, request: GuideChangeRequest) = auth.checkPermission(PERMISSION_GUIDE_ADMIN) {
        service.update(id, request)
    }

    fun delete(auth: Authentication, id: Long) = auth.checkPermission(PERMISSION_GUIDE_ADMIN) {
        service.delete(id)
    }
}