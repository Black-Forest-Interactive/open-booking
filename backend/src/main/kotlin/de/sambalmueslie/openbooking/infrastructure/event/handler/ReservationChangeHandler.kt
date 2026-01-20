package de.sambalmueslie.openbooking.infrastructure.event.handler

import de.sambalmueslie.openbooking.core.reservation.ReservationChangeListener
import de.sambalmueslie.openbooking.core.reservation.ReservationService
import de.sambalmueslie.openbooking.core.reservation.api.Reservation
import de.sambalmueslie.openbooking.core.reservation.api.ReservationConfirmationContent
import de.sambalmueslie.openbooking.infrastructure.event.EventService
import de.sambalmueslie.openbooking.infrastructure.event.api.ChangeEventType
import io.micronaut.context.annotation.Context

@Context
class ReservationChangeHandler(
    service: ReservationService,
    queue: EventService
) : EntityChangeHandler<Long, Reservation>(Reservation::class, queue), ReservationChangeListener {

    init {
        service.register(this)
    }

    override fun confirmed(reservation: Reservation, content: ReservationConfirmationContent) {
        publishEvent(ChangeEventType.OTHER, reservation)
    }

    override fun denied(reservation: Reservation, content: ReservationConfirmationContent) {
        publishEvent(ChangeEventType.OTHER, reservation)
    }

    override fun getStatus(obj: Reservation): String {
        return obj.status.name
    }
}