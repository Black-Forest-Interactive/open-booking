package de.sambalmueslie.openbooking.gateway.admin.notification

import de.sambalmueslie.openbooking.common.checkPermission
import de.sambalmueslie.openbooking.core.notification.NotificationTemplateService
import de.sambalmueslie.openbooking.core.notification.api.NotificationTemplateChangeRequest
import de.sambalmueslie.openbooking.gateway.admin.PERMISSION_NOTIFICATION_ADMIN
import io.micronaut.data.model.Pageable
import io.micronaut.http.annotation.Body
import io.micronaut.security.authentication.Authentication
import jakarta.inject.Singleton

@Singleton
class NotificationGateway(private val service: NotificationTemplateService) {
    fun getAll(auth: Authentication, pageable: Pageable) = auth.checkPermission(PERMISSION_NOTIFICATION_ADMIN) { service.getAll(pageable) }
    fun get(auth: Authentication, id: Long) = auth.checkPermission(PERMISSION_NOTIFICATION_ADMIN) { service.get(id) }
    fun create(auth: Authentication, @Body request: NotificationTemplateChangeRequest) = auth.checkPermission(PERMISSION_NOTIFICATION_ADMIN) { service.create(request) }
    fun update(auth: Authentication, id: Long, @Body request: NotificationTemplateChangeRequest) = auth.checkPermission(PERMISSION_NOTIFICATION_ADMIN) { service.update(id, request) }
    fun delete(auth: Authentication, id: Long) = auth.checkPermission(PERMISSION_NOTIFICATION_ADMIN) { service.delete(id) }
}