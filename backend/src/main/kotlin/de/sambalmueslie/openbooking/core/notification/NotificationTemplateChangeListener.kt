package de.sambalmueslie.openbooking.core.notification

import de.sambalmueslie.openbooking.common.BusinessObjectChangeListener
import de.sambalmueslie.openbooking.core.notification.api.NotificationTemplate

interface NotificationTemplateChangeListener : BusinessObjectChangeListener<Long, NotificationTemplate> {
}