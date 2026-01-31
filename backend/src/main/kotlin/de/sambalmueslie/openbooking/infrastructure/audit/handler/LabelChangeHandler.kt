package de.sambalmueslie.openbooking.infrastructure.audit.handler


import de.sambalmueslie.openbooking.common.TimeProvider
import de.sambalmueslie.openbooking.core.label.LabelChangeListener
import de.sambalmueslie.openbooking.core.label.LabelService
import de.sambalmueslie.openbooking.core.label.api.Label
import de.sambalmueslie.openbooking.core.label.api.LabelChangeRequest
import de.sambalmueslie.openbooking.infrastructure.audit.AuditLogEntryService
import de.sambalmueslie.openbooking.infrastructure.audit.api.AuditLogEntryChangeRequest
import de.sambalmueslie.openbooking.infrastructure.audit.api.AuditLogLevel
import io.micronaut.context.annotation.Context

@Context
class LabelChangeHandler(
    source: LabelService,
    private val service: AuditLogEntryService,
    private val timeProvider: TimeProvider
) : LabelChangeListener {

    init {
        source.register(this)
    }

    override fun handleCreated(obj: Label, request: LabelChangeRequest) {
        handleChange(obj, "LABEL CREATED")
    }

    override fun handleUpdated(obj: Label, request: LabelChangeRequest) {
        handleChange(obj, "LABEL UPDATED")
    }

    override fun handlePatched(obj: Label) {
        handleChange(obj, "LABEL PATCHED")
    }

    override fun handleDeleted(obj: Label) {
        handleChange(obj, "LABEL DELETED")
    }

    private fun handleChange(obj: Label, message: String) {
        service.create(AuditLogEntryChangeRequest(timeProvider.now(), "system", AuditLogLevel.INFO, message, obj.id.toString(), obj, "LABEL API"))
    }

}
