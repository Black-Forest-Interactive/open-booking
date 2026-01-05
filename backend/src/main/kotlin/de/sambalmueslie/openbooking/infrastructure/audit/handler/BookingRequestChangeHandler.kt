package de.sambalmueslie.openbooking.infrastructure.audit.handler


import de.sambalmueslie.openbooking.common.TimeProvider
import de.sambalmueslie.openbooking.core.request.BookingRequestChangeListener
import de.sambalmueslie.openbooking.core.request.BookingRequestService
import de.sambalmueslie.openbooking.core.request.api.BookingConfirmationContent
import de.sambalmueslie.openbooking.core.request.api.BookingRequest
import de.sambalmueslie.openbooking.infrastructure.audit.AuditLogEntryService
import de.sambalmueslie.openbooking.infrastructure.audit.api.AuditLogEntryChangeRequest
import de.sambalmueslie.openbooking.infrastructure.audit.api.AuditLogLevel
import io.micronaut.context.annotation.Context

@Context
class BookingRequestChangeHandler(
    source: BookingRequestService,
    private val service: AuditLogEntryService,
    private val timeProvider: TimeProvider
) : BookingRequestChangeListener {

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

    override fun confirmed(request: BookingRequest, content: BookingConfirmationContent) {
        handleChange(request, "BOOKING REQUEST CONFIRMED")
    }

    override fun denied(request: BookingRequest, content: BookingConfirmationContent) {
        handleChange(request, "BOOKING REQUEST DENIED")
    }

    private fun handleChange(obj: BookingRequest, message: String) {
        service.create(AuditLogEntryChangeRequest(timeProvider.now(), "system", AuditLogLevel.INFO, message, obj.id.toString(), obj, "BOOKING REQUEST API"))
    }

}
