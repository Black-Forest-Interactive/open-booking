package de.sambalmueslie.openbooking.gateway.admin.label

import de.sambalmueslie.openbooking.common.checkPermission
import de.sambalmueslie.openbooking.core.label.LabelService
import de.sambalmueslie.openbooking.core.label.api.LabelChangeRequest
import de.sambalmueslie.openbooking.gateway.admin.PERMISSION_LABEL_ADMIN
import io.micronaut.data.model.Pageable
import io.micronaut.security.authentication.Authentication
import jakarta.inject.Singleton

@Singleton
class LabelGateway(private val service: LabelService) {
    fun get(auth: Authentication, id: Long) = auth.checkPermission(PERMISSION_LABEL_ADMIN) {
        service.get(id)
    }

    fun getAll(auth: Authentication, pageable: Pageable) = auth.checkPermission(PERMISSION_LABEL_ADMIN) {
        service.getAll(pageable)
    }

    fun getAllSorted(auth: Authentication) = auth.checkPermission(PERMISSION_LABEL_ADMIN) {
        service.getSortedLabels()
    }

    fun create(auth: Authentication, request: LabelChangeRequest) = auth.checkPermission(PERMISSION_LABEL_ADMIN) {
        service.create(request)
    }

    fun update(auth: Authentication, id: Long, request: LabelChangeRequest) = auth.checkPermission(PERMISSION_LABEL_ADMIN) {
        service.update(id, request)
    }

    fun delete(auth: Authentication, id: Long) = auth.checkPermission(PERMISSION_LABEL_ADMIN) {
        service.delete(id)
    }
}