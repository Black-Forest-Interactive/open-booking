package de.sambalmueslie.openbooking.backend.audit.handler


import de.sambalmueslie.openbooking.backend.audit.AuditLogEntryService
import de.sambalmueslie.openbooking.backend.audit.api.AuditLogEntryChangeRequest
import de.sambalmueslie.openbooking.backend.audit.api.AuditLogLevel
import de.sambalmueslie.openbooking.backend.group.VisitorGroupService
import de.sambalmueslie.openbooking.backend.group.api.VisitorGroup
import de.sambalmueslie.openbooking.common.BusinessObjectChangeListener
import de.sambalmueslie.openbooking.common.TimeProvider
import io.micronaut.context.annotation.Context

@Context
class VisitorGroupChangeHandler(
    source: VisitorGroupService,
    private val service: AuditLogEntryService,
    private val timeProvider: TimeProvider
) : BusinessObjectChangeListener<Long, VisitorGroup> {

    init {
        source.register(this)
    }

    override fun handleCreated(obj: VisitorGroup) {
        handleChange(obj, "VISITOR GROUP CREATED")
    }

    override fun handleUpdated(obj: VisitorGroup) {
        handleChange(obj, "VISITOR GROUP UPDATED")
    }

    override fun handleDeleted(obj: VisitorGroup) {
        handleChange(obj, "VISITOR GROUP DELETED")
    }

    private fun handleChange(obj: VisitorGroup, message: String) {
        service.create(AuditLogEntryChangeRequest(timeProvider.now(), "system", AuditLogLevel.INFO, message, obj.id.toString(), obj, "VISITOR GROUP API"))
    }

}
