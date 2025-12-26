package de.sambalmueslie.openbooking.core.audit.handler


import de.sambalmueslie.openbooking.core.audit.AuditLogEntryService
import de.sambalmueslie.openbooking.core.audit.api.AuditLogEntryChangeRequest
import de.sambalmueslie.openbooking.core.audit.api.AuditLogLevel
import de.sambalmueslie.openbooking.core.settings.SettingsService
import de.sambalmueslie.openbooking.core.settings.api.Setting
import de.sambalmueslie.openbooking.common.BusinessObjectChangeListener
import de.sambalmueslie.openbooking.common.TimeProvider
import io.micronaut.context.annotation.Context

@Context
class SettingsChangeHandler(
    source: SettingsService,
    private val service: AuditLogEntryService,
    private val timeProvider: TimeProvider
) : BusinessObjectChangeListener<Long, Setting> {

    init {
        source.register(this)
    }

    override fun handleCreated(obj: Setting) {
        handleChange(obj, "SETTING CREATED")
    }

    override fun handleUpdated(obj: Setting) {
        handleChange(obj, "SETTING UPDATED")
    }

    override fun handleDeleted(obj: Setting) {
        handleChange(obj, "SETTING DELETED")
    }

    private fun handleChange(obj: Setting, message: String) {
        service.create(AuditLogEntryChangeRequest(timeProvider.now(), "system", AuditLogLevel.INFO, message, obj.id.toString(), obj, "SETTING API"))
    }

}
