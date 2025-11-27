package de.sambalmueslie.openbooking.backend.audit.handler


import de.sambalmueslie.openbooking.backend.audit.AuditLogEntryService
import de.sambalmueslie.openbooking.backend.audit.api.AuditLogEntryChangeRequest
import de.sambalmueslie.openbooking.backend.audit.api.AuditLogLevel
import de.sambalmueslie.openbooking.backend.notification.NotificationTemplateService
import de.sambalmueslie.openbooking.backend.notification.api.NotificationTemplate
import de.sambalmueslie.openbooking.common.BusinessObjectChangeListener
import de.sambalmueslie.openbooking.common.TimeProvider
import io.micronaut.context.annotation.Context

@Context
class NotificationTemplateChangeHandler(
    source: NotificationTemplateService,
    private val service: AuditLogEntryService,
    private val timeProvider: TimeProvider
) : BusinessObjectChangeListener<Long, NotificationTemplate> {

    init {
        source.register(this)
    }

    override fun handleCreated(obj: NotificationTemplate) {
        handleChange(obj, "NOTIFICATION TEMPLATE CREATED")
    }

    override fun handleUpdated(obj: NotificationTemplate) {
        handleChange(obj, "NOTIFICATION TEMPLATE UPDATED")
    }

    override fun handleDeleted(obj: NotificationTemplate) {
        handleChange(obj, "NOTIFICATION TEMPLATE DELETED")
    }

    private fun handleChange(obj: NotificationTemplate, message: String) {
        service.create(AuditLogEntryChangeRequest(timeProvider.now(), "system", AuditLogLevel.INFO, message,obj.id.toString(), obj, "NOTIFICATION TEMPLATE API"))
    }

}
