package de.sambalmueslie.openbooking.infrastructure.event.handler

import de.sambalmueslie.openbooking.core.booking.BookingChangeListener
import de.sambalmueslie.openbooking.core.booking.BookingService
import de.sambalmueslie.openbooking.core.booking.api.Booking
import de.sambalmueslie.openbooking.core.booking.api.BookingChangeRequest
import de.sambalmueslie.openbooking.core.booking.api.BookingConfirmationContent
import de.sambalmueslie.openbooking.infrastructure.event.EventService
import de.sambalmueslie.openbooking.infrastructure.event.api.ChangeEventType
import io.micronaut.context.annotation.Context

@Context
class BookingChangeHandler(
    service: BookingService,
    queue: EventService
) : EntityChangeHandler<Long, Booking, BookingChangeRequest>(Booking::class, queue), BookingChangeListener {

    init {
        service.register(this)
    }

    override fun canceled(booking: Booking) {
        publishEvent(ChangeEventType.OTHER, booking)
    }

    override fun confirmed(booking: Booking, content: BookingConfirmationContent) {
        publishEvent(ChangeEventType.OTHER, booking)
    }

    override fun declined(booking: Booking, content: BookingConfirmationContent) {
        publishEvent(ChangeEventType.OTHER, booking)
    }

    override fun getStatus(obj: Booking): String {
        return obj.status.name
    }
}