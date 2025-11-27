package de.sambalmueslie.openbooking.backend.notification.api

import de.sambalmueslie.openbooking.common.AuthCrudAPI

interface NotificationTemplateAPI : AuthCrudAPI<Long, NotificationTemplate, NotificationTemplateChangeRequest> {
    companion object {
        const val PERMISSION_READ = "openbooking.notification.template.read"
        const val PERMISSION_WRITE = "openbooking.notification.template.write"
    }
}
