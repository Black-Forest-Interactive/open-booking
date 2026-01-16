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
    private val queue: EventService
) : BusinessObjectChangeHandler<Long, Reservation>(Reservation::class, queue), ReservationChangeListener {

    init {
        service.register(this)
    }


    override fun confirmed(reservation: Reservation, content: ReservationConfirmationContent) {
        queue.publishEvent(ChangeEventType.OTHER, reservation.id.toString(), Reservation::class.simpleName!!)
    }

    override fun denied(reservation: Reservation, content: ReservationConfirmationContent) {
        queue.publishEvent(ChangeEventType.OTHER, reservation.id.toString(), Reservation::class.simpleName!!)
    }
}