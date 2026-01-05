package de.sambalmueslie.openbooking.infrastructure.audit.handler


import de.sambalmueslie.openbooking.common.TimeProvider
import de.sambalmueslie.openbooking.core.reservation.ReservationChangeListener
import de.sambalmueslie.openbooking.core.reservation.ReservationService
import de.sambalmueslie.openbooking.core.reservation.api.Reservation
import de.sambalmueslie.openbooking.core.reservation.api.ReservationConfirmationContent
import de.sambalmueslie.openbooking.infrastructure.audit.AuditLogEntryService
import de.sambalmueslie.openbooking.infrastructure.audit.api.AuditLogEntryChangeRequest
import de.sambalmueslie.openbooking.infrastructure.audit.api.AuditLogLevel
import io.micronaut.context.annotation.Context

@Context
class ReservationChangeHandler(
    source: ReservationService,
    private val service: AuditLogEntryService,
    private val timeProvider: TimeProvider
) : ReservationChangeListener {

    init {
        source.register(this)
    }

    override fun handleCreated(obj: Reservation) {
        handleChange(obj, "RESERVATION CREATED")
    }

    override fun handleUpdated(obj: Reservation) {
        handleChange(obj, "RESERVATION UPDATED")
    }

    override fun handleDeleted(obj: Reservation) {
        handleChange(obj, "RESERVATION DELETED")
    }

    override fun confirmed(request: Reservation, content: ReservationConfirmationContent) {
        handleChange(request, "RESERVATION CONFIRMED")
    }

    override fun denied(request: Reservation, content: ReservationConfirmationContent) {
        handleChange(request, "RESERVATION DENIED")
    }

    private fun handleChange(obj: Reservation, message: String) {
        service.create(AuditLogEntryChangeRequest(timeProvider.now(), "system", AuditLogLevel.INFO, message, obj.id.toString(), obj, "RESERVATION API"))
    }

}
