package de.sambalmueslie.openbooking.core.notification

import de.sambalmueslie.openbooking.common.EntityChangeListener
import de.sambalmueslie.openbooking.core.notification.api.NotificationTemplate
import de.sambalmueslie.openbooking.core.notification.api.NotificationTemplateChangeRequest

interface NotificationTemplateChangeListener : EntityChangeListener<Long, NotificationTemplate, NotificationTemplateChangeRequest> {
}