package de.sambalmueslie.openbooking.core.notification.api

import de.sambalmueslie.openbooking.common.Entity
import java.time.LocalDateTime

data class NotificationTemplate(
    override val id: Long,
    val lang: String,
    val type: NotificationTemplateType,
    val subject: String,
    val contentType: ContentType,
    val content: String,
    override val created: LocalDateTime,
    override val updated: LocalDateTime?,
) : Entity<Long>
