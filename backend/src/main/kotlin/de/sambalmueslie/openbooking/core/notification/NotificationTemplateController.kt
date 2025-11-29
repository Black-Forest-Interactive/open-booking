package de.sambalmueslie.openbooking.core.notification


import de.sambalmueslie.openbooking.core.notification.api.NotificationTemplateAPI
import de.sambalmueslie.openbooking.core.notification.api.NotificationTemplateAPI.Companion.PERMISSION_READ
import de.sambalmueslie.openbooking.core.notification.api.NotificationTemplateAPI.Companion.PERMISSION_WRITE
import de.sambalmueslie.openbooking.core.notification.api.NotificationTemplateChangeRequest
import de.sambalmueslie.openbooking.common.checkPermission
import io.micronaut.data.model.Pageable
import io.micronaut.http.annotation.*
import io.micronaut.security.authentication.Authentication
import io.swagger.v3.oas.annotations.tags.Tag

@Controller("/api/backend/notification/template")
@Tag(name = "Notification Template API")
@Deprecated("move that to gateway")
class NotificationTemplateController(private val service: NotificationTemplateService) : NotificationTemplateAPI {
    @Get()
    override fun getAll(auth: Authentication, pageable: Pageable) = auth.checkPermission(PERMISSION_READ) { service.getAll(pageable) }

    @Get("/{id}")
    override fun get(auth: Authentication, @PathVariable id: Long) = auth.checkPermission(PERMISSION_READ) { service.get(id) }

    @Post()
    override fun create(auth: Authentication, @Body request: NotificationTemplateChangeRequest) =
        auth.checkPermission(PERMISSION_WRITE) { service.create(request) }

    @Put("/{id}")
    override fun update(auth: Authentication, @PathVariable id: Long, @Body request: NotificationTemplateChangeRequest) =
        auth.checkPermission(PERMISSION_WRITE) { service.update(id, request) }

    @Delete("/{id}")
    override fun delete(auth: Authentication, @PathVariable id: Long) =
        auth.checkPermission(PERMISSION_WRITE) { service.delete(id) }
}
