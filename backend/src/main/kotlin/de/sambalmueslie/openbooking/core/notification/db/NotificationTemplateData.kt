package de.sambalmueslie.openbooking.core.notification.db

import de.sambalmueslie.openbooking.common.EntityData
import de.sambalmueslie.openbooking.core.notification.api.ContentType
import de.sambalmueslie.openbooking.core.notification.api.NotificationTemplate
import de.sambalmueslie.openbooking.core.notification.api.NotificationTemplateChangeRequest
import de.sambalmueslie.openbooking.core.notification.api.NotificationTemplateType
import jakarta.persistence.*
import java.time.LocalDateTime

@Entity(name = "NotificationTemplate")
@Table(name = "notification_template")
data class NotificationTemplateData(
    @Id @GeneratedValue var id: Long,
    @Column var lang: String,
    @Column @Enumerated(EnumType.STRING) var type: NotificationTemplateType,
    @Column var subject: String,
    @Column @Enumerated(EnumType.STRING) var contentType: ContentType,
    @Column var content: String,

    @Column var created: LocalDateTime,
    @Column var updated: LocalDateTime? = null,
) : EntityData<NotificationTemplate> {

    companion object {
        fun create(request: NotificationTemplateChangeRequest, timestamp: LocalDateTime): NotificationTemplateData {
            return NotificationTemplateData(
                0,
                request.lang,
                request.type,
                request.subject,
                request.contentType,
                request.content,
                timestamp
            )
        }
    }

    override fun convert(): NotificationTemplate {
        return NotificationTemplate(id, lang, type, subject, contentType, content, created, updated)
    }

    fun update(request: NotificationTemplateChangeRequest, timestamp: LocalDateTime): NotificationTemplateData {
        lang = request.lang
        type = request.type
        subject = request.subject
        contentType = request.contentType
        content = request.content
        updated = timestamp
        return this
    }
}
