package de.sambalmueslie.openbooking.infrastructure.audit.handler


import de.sambalmueslie.openbooking.common.TimeProvider
import de.sambalmueslie.openbooking.core.booking.BookingChangeListener
import de.sambalmueslie.openbooking.core.booking.BookingService
import de.sambalmueslie.openbooking.core.booking.api.Booking
import de.sambalmueslie.openbooking.core.booking.api.BookingConfirmationContent
import de.sambalmueslie.openbooking.infrastructure.audit.AuditLogEntryService
import de.sambalmueslie.openbooking.infrastructure.audit.api.AuditLogEntryChangeRequest
import de.sambalmueslie.openbooking.infrastructure.audit.api.AuditLogLevel
import io.micronaut.context.annotation.Context

@Context
class BookingChangeHandler(
    source: BookingService,
    private val service: AuditLogEntryService,
    private val timeProvider: TimeProvider
) : BookingChangeListener {

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

    override fun confirmed(booking: Booking, content: BookingConfirmationContent) {
        handleChange(booking, "BOOKING Confirmed")
    }

    override fun declined(booking: Booking, content: BookingConfirmationContent) {
        handleChange(booking, "BOOKING Denied")
    }

    override fun canceled(booking: Booking) {
        handleChange(booking, "BOOKING Canceled")
    }

    private fun handleChange(obj: Booking, message: String) {
        service.create(AuditLogEntryChangeRequest(timeProvider.now(), "system", AuditLogLevel.INFO, message, obj.id.toString(), obj, "BOOKING API"))
    }

}
