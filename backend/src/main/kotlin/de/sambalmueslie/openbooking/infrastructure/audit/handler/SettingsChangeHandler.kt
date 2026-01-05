package de.sambalmueslie.openbooking.infrastructure.audit.handler


import de.sambalmueslie.openbooking.common.TimeProvider
import de.sambalmueslie.openbooking.infrastructure.audit.AuditLogEntryService
import de.sambalmueslie.openbooking.infrastructure.audit.api.AuditLogEntryChangeRequest
import de.sambalmueslie.openbooking.infrastructure.audit.api.AuditLogLevel
import de.sambalmueslie.openbooking.infrastructure.settings.SettingChangeListener
import de.sambalmueslie.openbooking.infrastructure.settings.SettingService
import de.sambalmueslie.openbooking.infrastructure.settings.api.Setting
import io.micronaut.context.annotation.Context

@Context
class SettingsChangeHandler(
    source: SettingService,
    private val service: AuditLogEntryService,
    private val timeProvider: TimeProvider
) : SettingChangeListener {

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
