package de.sambalmueslie.openbooking.core.notification.handler


import de.sambalmueslie.openbooking.common.BusinessObjectChangeListener
import de.sambalmueslie.openbooking.core.notification.NotificationService
import de.sambalmueslie.openbooking.core.notification.api.NotificationEvent
import de.sambalmueslie.openbooking.core.notification.api.NotificationEventType
import de.sambalmueslie.openbooking.core.request.BookingRequestService
import de.sambalmueslie.openbooking.core.request.api.BookingConfirmationContent
import de.sambalmueslie.openbooking.core.request.api.BookingRequest
import de.sambalmueslie.openbooking.core.request.api.BookingRequestChangeListener
import io.micronaut.context.annotation.Context
import org.slf4j.LoggerFactory

@Context
@Deprecated("use reservation instead.", ReplaceWith("reservation"))
class BookingRequestChangeHandler(
    source: BookingRequestService,
    private val service: NotificationService,
) : BusinessObjectChangeListener<Long, BookingRequest>, BookingRequestChangeListener {

    companion object {
        private val logger = LoggerFactory.getLogger(BookingRequestChangeHandler::class.java)
        const val TYPE_KEY = "type"
        const val TYPE_CONFIRMED = "confirmed"
        const val TYPE_DENIED = "denied"
        const val CONTENT = "content"
    }

    init {
        source.register(this as BusinessObjectChangeListener<Long, BookingRequest>)
        source.register(this as BookingRequestChangeListener)
    }

    override fun handleCreated(obj: BookingRequest) {
        createEvent(obj, NotificationEventType.OBJ_CREATED)
    }

    override fun confirmed(request: BookingRequest, content: BookingConfirmationContent) {
        if (content.silent) return
        createEvent(request, NotificationEventType.CUSTOM, mapOf(Pair(TYPE_KEY, TYPE_CONFIRMED), Pair(CONTENT, content)))
    }

    override fun denied(request: BookingRequest, content: BookingConfirmationContent) {
        if (content.silent) return
        createEvent(request, NotificationEventType.CUSTOM, mapOf(Pair(TYPE_KEY, TYPE_DENIED), Pair(CONTENT, content)))
    }

    private fun createEvent(request: BookingRequest, type: NotificationEventType, parameter: Map<String, Any> = emptyMap()) {
        service.add(NotificationEvent(request.id, BookingRequest::class, type, parameter))
    }


}
