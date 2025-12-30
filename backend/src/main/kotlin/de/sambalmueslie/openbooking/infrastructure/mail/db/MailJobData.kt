package de.sambalmueslie.openbooking.infrastructure.mail.db

import de.sambalmueslie.openbooking.common.DataObject
import jakarta.persistence.*
import java.time.LocalDateTime

@Entity(name = "MailJob")
@Table(name = "mail_job")
data class MailJobData(
    @Id @GeneratedValue var id: Long,
    @Column @Enumerated(EnumType.STRING) var status: de.sambalmueslie.openbooking.infrastructure.mail.api.MailJobStatus,
    @Column var title: String,
    @Column var created: LocalDateTime,
    @Column var updated: LocalDateTime? = null,
) : DataObject<de.sambalmueslie.openbooking.infrastructure.mail.api.MailJob> {

    companion object {
        fun create(title: String, timestamp: LocalDateTime): de.sambalmueslie.openbooking.infrastructure.mail.db.MailJobData {
            return _root_ide_package_.de.sambalmueslie.openbooking.infrastructure.mail.db.MailJobData(
                0,
                _root_ide_package_.de.sambalmueslie.openbooking.infrastructure.mail.api.MailJobStatus.QUEUED,
                title,
                timestamp,
                timestamp
            )
        }

    }

    override fun convert(): de.sambalmueslie.openbooking.infrastructure.mail.api.MailJob {
        val timestamp = updated ?: created
        return _root_ide_package_.de.sambalmueslie.openbooking.infrastructure.mail.api.MailJob(id, title, status, timestamp)
    }

    fun updateStatus(status: de.sambalmueslie.openbooking.infrastructure.mail.api.MailJobStatus, timestamp: LocalDateTime): de.sambalmueslie.openbooking.infrastructure.mail.db.MailJobData {
        this.status = status
        this.updated = timestamp
        return this
    }
}
