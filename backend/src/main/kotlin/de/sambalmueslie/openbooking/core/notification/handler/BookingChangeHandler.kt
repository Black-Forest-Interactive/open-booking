package de.sambalmueslie.openbooking.core.notification.handler

import de.sambalmueslie.openbooking.core.booking.BookingChangeListener
import de.sambalmueslie.openbooking.core.booking.BookingService
import de.sambalmueslie.openbooking.core.booking.api.Booking
import de.sambalmueslie.openbooking.core.booking.api.BookingConfirmationContent
import de.sambalmueslie.openbooking.core.notification.NotificationService
import de.sambalmueslie.openbooking.core.notification.api.NotificationEvent
import de.sambalmueslie.openbooking.core.notification.api.NotificationEventType
import io.micronaut.context.annotation.Context
import org.slf4j.LoggerFactory

@Context
class BookingChangeHandler(
    source: BookingService,
    private val service: NotificationService,
) : BookingChangeListener {

    companion object {
        private val logger = LoggerFactory.getLogger(BookingChangeHandler::class.java)
        const val TYPE_KEY = "type"
        const val TYPE_CONFIRMED = "confirmed"
        const val TYPE_DENIED = "denied"
        const val TYPE_CANCELED = "canceled"
        const val CONTENT = "content"
    }

    init {
        source.register(this)
    }

    override fun handleCreated(obj: Booking) {
        createEvent(obj, NotificationEventType.OBJ_CREATED)
    }

    override fun confirmed(booking: Booking, content: BookingConfirmationContent) {
        if (content.silent) return
        createEvent(booking, NotificationEventType.CUSTOM, mapOf(Pair(TYPE_KEY, TYPE_CONFIRMED), Pair(CONTENT, content)))
    }

    override fun declined(booking: Booking, content: BookingConfirmationContent) {
        if (content.silent) return
        createEvent(booking, NotificationEventType.CUSTOM, mapOf(Pair(TYPE_KEY, TYPE_DENIED), Pair(CONTENT, content)))
    }

    override fun canceled(booking: Booking) {
        createEvent(booking, NotificationEventType.CUSTOM, mapOf(Pair(TYPE_KEY, TYPE_CANCELED)))
    }


    private fun createEvent(request: Booking, type: NotificationEventType, parameter: Map<String, Any> = emptyMap()) {
        service.add(NotificationEvent(request.id, Booking::class, type, parameter))
    }
}