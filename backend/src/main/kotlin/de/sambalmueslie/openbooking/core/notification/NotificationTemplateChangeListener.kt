package de.sambalmueslie.openbooking.core.notification

import de.sambalmueslie.openbooking.common.EntityChangeListener
import de.sambalmueslie.openbooking.core.notification.api.NotificationTemplate

interface NotificationTemplateChangeListener : EntityChangeListener<Long, NotificationTemplate> {
}