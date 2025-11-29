package de.sambalmueslie.openbooking.core.notification.api

import kotlin.reflect.KClass


data class NotificationEvent(
    val sourceId: Long,
    val sourceType: KClass<*>,
    val type: NotificationEventType,
    val parameter: Map<String, Any> = emptyMap()
)
