package de.sambalmueslie.openbooking.backend.audit.handler


import de.sambalmueslie.openbooking.backend.audit.AuditLogEntryService
import de.sambalmueslie.openbooking.backend.audit.api.AuditLogEntryChangeRequest
import de.sambalmueslie.openbooking.backend.audit.api.AuditLogLevel
import de.sambalmueslie.openbooking.backend.response.ResponseService
import de.sambalmueslie.openbooking.backend.response.api.Response
import de.sambalmueslie.openbooking.common.BusinessObjectChangeListener
import de.sambalmueslie.openbooking.common.TimeProvider
import io.micronaut.context.annotation.Context

@Context
class ResponseChangeHandler(
    source: ResponseService,
    private val service: AuditLogEntryService,
    private val timeProvider: TimeProvider
) : BusinessObjectChangeListener<Long, Response> {

    init {
        source.register(this)
    }

    override fun handleCreated(obj: Response) {
        handleChange(obj, "RESPONSE CREATED")
    }

    override fun handleUpdated(obj: Response) {
        handleChange(obj, "RESPONSE UPDATED")
    }

    override fun handleDeleted(obj: Response) {
        handleChange(obj, "RESPONSE DELETED")
    }

    private fun handleChange(obj: Response, message: String) {
        service.create(AuditLogEntryChangeRequest(timeProvider.now(), "system", AuditLogLevel.INFO, message,obj.id.toString(), obj, "RESPONSE API"))
    }

}
