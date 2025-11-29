package de.sambalmueslie.openbooking.core.audit.handler


import de.sambalmueslie.openbooking.core.audit.AuditLogEntryService
import de.sambalmueslie.openbooking.core.audit.api.AuditLogEntryChangeRequest
import de.sambalmueslie.openbooking.core.audit.api.AuditLogLevel
import de.sambalmueslie.openbooking.core.request.BookingRequestService
import de.sambalmueslie.openbooking.core.request.api.BookingRequest
import de.sambalmueslie.openbooking.common.BusinessObjectChangeListener
import de.sambalmueslie.openbooking.common.TimeProvider
import io.micronaut.context.annotation.Context

@Context
class BookingRequestChangeHandler(
    source: BookingRequestService,
    private val service: AuditLogEntryService,
    private val timeProvider: TimeProvider
) : BusinessObjectChangeListener<Long, BookingRequest> {

    init {
        source.register(this)
    }

    override fun handleCreated(obj: BookingRequest) {
        handleChange(obj, "BOOKING REQUEST CREATED")
    }

    override fun handleUpdated(obj: BookingRequest) {
        handleChange(obj, "BOOKING REQUEST UPDATED")
    }

    override fun handleDeleted(obj: BookingRequest) {
        handleChange(obj, "BOOKING REQUEST DELETED")
    }

    private fun handleChange(obj: BookingRequest, message: String) {
        service.create(AuditLogEntryChangeRequest(timeProvider.now(), "system", AuditLogLevel.INFO, message,obj.id.toString(), obj, "BOOKING REQUEST API"))
    }

}
