package de.sambalmueslie.openbooking.core.audit.handler


import de.sambalmueslie.openbooking.core.audit.AuditLogEntryService
import de.sambalmueslie.openbooking.core.audit.api.AuditLogEntryChangeRequest
import de.sambalmueslie.openbooking.core.audit.api.AuditLogLevel
import de.sambalmueslie.openbooking.core.booking.BookingService
import de.sambalmueslie.openbooking.core.booking.api.Booking
import de.sambalmueslie.openbooking.common.BusinessObjectChangeListener
import de.sambalmueslie.openbooking.common.TimeProvider
import io.micronaut.context.annotation.Context

@Context
class BookingChangeHandler(
    source: BookingService,
    private val service: AuditLogEntryService,
    private val timeProvider: TimeProvider
) : BusinessObjectChangeListener<Long, Booking> {

    init {
        source.register(this)
    }

    override fun handleCreated(obj: Booking) {
        handleChange(obj, "BOOKING CREATED")
    }

    override fun handleUpdated(obj: Booking) {
        handleChange(obj, "BOOKING UPDATED")
    }

    override fun handleDeleted(obj: Booking) {
        handleChange(obj, "BOOKING DELETED")
    }

    private fun handleChange(obj: Booking, message: String) {
        service.create(AuditLogEntryChangeRequest(timeProvider.now(), "system", AuditLogLevel.INFO, message, obj.id.toString(), obj, "BOOKING API"))
    }

}
