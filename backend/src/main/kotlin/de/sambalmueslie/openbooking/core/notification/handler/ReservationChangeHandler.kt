package de.sambalmueslie.openbooking.core.notification.handler

import de.sambalmueslie.openbooking.core.notification.NotificationService
import de.sambalmueslie.openbooking.core.notification.api.NotificationEvent
import de.sambalmueslie.openbooking.core.notification.api.NotificationEventType
import de.sambalmueslie.openbooking.core.reservation.ReservationChangeListener
import de.sambalmueslie.openbooking.core.reservation.ReservationService
import de.sambalmueslie.openbooking.core.reservation.api.Reservation
import de.sambalmueslie.openbooking.core.reservation.api.ReservationConfirmationContent
import io.micronaut.context.annotation.Context
import org.slf4j.LoggerFactory

@Context
class ReservationChangeHandler(
    source: ReservationService,
    private val service: NotificationService,
) : ReservationChangeListener {

    companion object {
        private val logger = LoggerFactory.getLogger(ReservationChangeHandler::class.java)
        const val TYPE_KEY = "type"
        const val TYPE_CONFIRMED = "confirmed"
        const val TYPE_DENIED = "denied"
        const val CONTENT = "content"
    }

    init {
        source.register(this)
    }

    override fun handleCreated(obj: Reservation) {
        createEvent(obj, NotificationEventType.OBJ_CREATED)
    }

    override fun confirmed(reservation: Reservation, content: ReservationConfirmationContent) {
        if (content.silent) return
        createEvent(reservation, NotificationEventType.CUSTOM, mapOf(Pair(TYPE_KEY, TYPE_CONFIRMED), Pair(CONTENT, content)))
    }

    override fun denied(reservation: Reservation, content: ReservationConfirmationContent) {
        if (content.silent) return
        createEvent(reservation, NotificationEventType.CUSTOM, mapOf(Pair(TYPE_KEY, TYPE_DENIED), Pair(CONTENT, content)))
    }

    private fun createEvent(request: Reservation, type: NotificationEventType, parameter: Map<String, Any> = emptyMap()) {
        service.add(NotificationEvent(request.id, Reservation::class, type, parameter))
    }

}