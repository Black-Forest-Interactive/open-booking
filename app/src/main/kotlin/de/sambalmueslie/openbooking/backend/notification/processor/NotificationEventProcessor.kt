package de.sambalmueslie.openbooking.backend.notification.processor

import de.sambalmueslie.openbooking.backend.notification.api.NotificationEvent

interface NotificationEventProcessor {

    fun process(event: NotificationEvent)
}
