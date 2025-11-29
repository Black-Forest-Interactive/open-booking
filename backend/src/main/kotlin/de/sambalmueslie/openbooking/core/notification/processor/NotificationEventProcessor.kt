package de.sambalmueslie.openbooking.core.notification.processor

import de.sambalmueslie.openbooking.core.notification.api.NotificationEvent

interface NotificationEventProcessor {

    fun process(event: NotificationEvent)
}
