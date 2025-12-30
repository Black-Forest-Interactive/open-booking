package de.sambalmueslie.openbooking.core.mail.db

import de.sambalmueslie.openbooking.common.DataObject
import de.sambalmueslie.openbooking.core.mail.api.MailJobHistoryEntry
import jakarta.persistence.*
import java.time.LocalDateTime

@Entity(name = "MailJobHistory")
@Table(name = "mail_job_history")
data class MailJobHistoryEntryData(
    @Id @GeneratedValue var id: Long,
    @Column var message: String,
    @Column var timestamp: LocalDateTime,
    @Column var jobId: Long
) : DataObject<MailJobHistoryEntry> {
    override fun convert(): MailJobHistoryEntry {
        return MailJobHistoryEntry(id, message, timestamp)
    }
}
