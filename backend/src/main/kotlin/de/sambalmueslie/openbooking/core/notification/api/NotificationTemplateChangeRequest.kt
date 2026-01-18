package de.sambalmueslie.openbooking.core.notification.api

import de.sambalmueslie.openbooking.common.EntityChangeRequest

data class NotificationTemplateChangeRequest(
    val lang: String,
    val type: NotificationTemplateType,
    val subject: String,
    val contentType: ContentType = ContentType.HTML,
    val content: String
) : EntityChangeRequest
