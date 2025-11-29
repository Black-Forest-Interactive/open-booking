package de.sambalmueslie.openbooking.backend.notification.db

import de.sambalmueslie.openbooking.backend.notification.api.ContentType
import de.sambalmueslie.openbooking.backend.notification.api.NotificationTemplate
import de.sambalmueslie.openbooking.backend.notification.api.NotificationTemplateChangeRequest
import de.sambalmueslie.openbooking.backend.notification.api.NotificationTemplateType
import de.sambalmueslie.openbooking.common.DataObject
import jakarta.persistence.*
import java.time.LocalDateTime

@Suppress("JpaObjectClassSignatureInspection")
@Entity(name = "NotificationTemplate")
@Table(name = "notification_template")
data class NotificationTemplateData(
    @Id @GeneratedValue(strategy = GenerationType.SEQUENCE) var id: Long,
    @Column var lang: String,
    @Column @Enumerated(EnumType.STRING) var type: NotificationTemplateType,
    @Column var subject: String,
    @Column @Enumerated(EnumType.STRING) var contentType: ContentType,
    @Column var content: String,

    @Column var created: LocalDateTime,
    @Column var updated: LocalDateTime? = null,
) : DataObject<NotificationTemplate> {

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
        return NotificationTemplate(id, lang, type, subject, contentType, content)
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
