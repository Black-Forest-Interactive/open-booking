package de.sambalmueslie.openbooking.backend.notification.api

import de.sambalmueslie.openbooking.common.BusinessObject

data class NotificationTemplate(
    override val id: Long,
    val lang: String,
    val type: NotificationTemplateType,
    val subject: String,
    val contentType: ContentType,
    val content: String
) : BusinessObject<Long>
