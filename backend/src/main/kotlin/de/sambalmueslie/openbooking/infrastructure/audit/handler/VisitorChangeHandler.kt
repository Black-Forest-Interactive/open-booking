package de.sambalmueslie.openbooking.infrastructure.audit.handler


import de.sambalmueslie.openbooking.common.TimeProvider
import de.sambalmueslie.openbooking.core.visitor.VisitorChangeListener
import de.sambalmueslie.openbooking.core.visitor.VisitorService
import de.sambalmueslie.openbooking.core.visitor.api.Visitor
import de.sambalmueslie.openbooking.core.visitor.api.VisitorChangeRequest
import de.sambalmueslie.openbooking.infrastructure.audit.AuditLogEntryService
import de.sambalmueslie.openbooking.infrastructure.audit.api.AuditLogEntryChangeRequest
import de.sambalmueslie.openbooking.infrastructure.audit.api.AuditLogLevel
import io.micronaut.context.annotation.Context

@Context
class VisitorChangeHandler(
    source: VisitorService,
    private val service: AuditLogEntryService,
    private val timeProvider: TimeProvider
) : VisitorChangeListener {

    init {
        source.register(this)
    }

    override fun handleCreated(obj: Visitor, request: VisitorChangeRequest) {
        handleChange(obj, "VISITOR CREATED")
    }

    override fun handleUpdated(obj: Visitor, request: VisitorChangeRequest) {
        handleChange(obj, "VISITOR UPDATED")
    }

    override fun handlePatched(obj: Visitor) {
        handleChange(obj, "VISITOR PATCHED")
    }

    override fun handleDeleted(obj: Visitor) {
        handleChange(obj, "VISITOR DELETED")
    }

    private fun handleChange(obj: Visitor, message: String) {
        service.create(AuditLogEntryChangeRequest(timeProvider.now(), "system", AuditLogLevel.INFO, message, obj.id.toString(), obj, "VISITOR API"))
    }

}
