package de.sambalmueslie.openbooking.infrastructure.event.handler

import de.sambalmueslie.openbooking.core.booking.BookingChangeListener
import de.sambalmueslie.openbooking.core.booking.BookingService
import de.sambalmueslie.openbooking.core.booking.api.Booking
import de.sambalmueslie.openbooking.infrastructure.event.EventService
import io.micronaut.context.annotation.Context

@Context
class BookingChangeHandler(
    service: BookingService,
    queue: EventService
) : EntityChangeHandler<Long, Booking>(Booking::class, queue), BookingChangeListener {

    init {
        service.register(this)
    }

}