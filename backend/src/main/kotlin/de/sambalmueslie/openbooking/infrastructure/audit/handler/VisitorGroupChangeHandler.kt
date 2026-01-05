package de.sambalmueslie.openbooking.infrastructure.audit.handler


import de.sambalmueslie.openbooking.common.BusinessObjectChangeListener
import de.sambalmueslie.openbooking.common.TimeProvider
import de.sambalmueslie.openbooking.core.visitor.VisitorService
import de.sambalmueslie.openbooking.core.visitor.api.Visitor
import de.sambalmueslie.openbooking.infrastructure.audit.AuditLogEntryService
import de.sambalmueslie.openbooking.infrastructure.audit.api.AuditLogEntryChangeRequest
import de.sambalmueslie.openbooking.infrastructure.audit.api.AuditLogLevel
import io.micronaut.context.annotation.Context

@Context
class VisitorChangeHandler(
    source: VisitorService,
    private val service: AuditLogEntryService,
    private val timeProvider: TimeProvider
) : BusinessObjectChangeListener<Long, Visitor> {

    init {
        source.register(this)
    }

    override fun handleCreated(obj: Visitor) {
        handleChange(obj, "VISITOR GROUP CREATED")
    }

    override fun handleUpdated(obj: Visitor) {
        handleChange(obj, "VISITOR GROUP UPDATED")
    }

    override fun handleDeleted(obj: Visitor) {
        handleChange(obj, "VISITOR GROUP DELETED")
    }

    private fun handleChange(obj: Visitor, message: String) {
        service.create(AuditLogEntryChangeRequest(timeProvider.now(), "system", AuditLogLevel.INFO, message, obj.id.toString(), obj, "VISITOR GROUP API"))
    }

}
