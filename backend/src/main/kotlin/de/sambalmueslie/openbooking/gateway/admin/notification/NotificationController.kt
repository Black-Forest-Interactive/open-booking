package de.sambalmueslie.openbooking.gateway.admin.notification

import de.sambalmueslie.openbooking.core.notification.api.NotificationTemplateChangeRequest
import io.micronaut.data.model.Pageable
import io.micronaut.http.annotation.*
import io.micronaut.security.authentication.Authentication
import io.swagger.v3.oas.annotations.tags.Tag


@Controller("/api/admin/notification")
@Tag(name = "Admin Notification API")
class NotificationController(private val gateway: NotificationGateway) {
    @Get()
    fun getAll(auth: Authentication, pageable: Pageable) = gateway.getAll(auth, pageable)

    @Get("/{id}")
    fun get(auth: Authentication, id: Long) = gateway.get(auth, id)

    @Post()
    fun create(auth: Authentication, @Body request: NotificationTemplateChangeRequest) = gateway.create(auth, request)

    @Put("/{id}")
    fun update(auth: Authentication, id: Long, @Body request: NotificationTemplateChangeRequest) = gateway.update(auth, id, request)

    @Delete("/{id}")
    fun delete(auth: Authentication, id: Long) = gateway.delete(auth, id)
}