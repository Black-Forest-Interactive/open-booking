package de.sambalmueslie.openbooking.infrastructure.mail.db

import de.sambalmueslie.openbooking.common.DataObject
import jakarta.persistence.*
import java.time.LocalDateTime

@Entity(name = "MailJobHistory")
@Table(name = "mail_job_history")
data class MailJobHistoryEntryData(
    @Id @GeneratedValue var id: Long,
    @Column var message: String,
    @Column var timestamp: LocalDateTime,
    @Column var jobId: Long
) : DataObject<de.sambalmueslie.openbooking.infrastructure.mail.api.MailJobHistoryEntry> {
    override fun convert(): de.sambalmueslie.openbooking.infrastructure.mail.api.MailJobHistoryEntry {
        return _root_ide_package_.de.sambalmueslie.openbooking.infrastructure.mail.api.MailJobHistoryEntry(id, message, timestamp)
    }
}
