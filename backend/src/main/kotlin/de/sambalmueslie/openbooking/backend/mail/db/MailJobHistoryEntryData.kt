package de.sambalmueslie.openbooking.backend.mail.db

import de.sambalmueslie.openbooking.backend.mail.api.MailJobHistoryEntry
import de.sambalmueslie.openbooking.common.DataObject
import jakarta.persistence.*
import java.time.LocalDateTime

@Suppress("JpaObjectClassSignatureInspection")
@Entity(name = "MailJobHistory")
@Table(name = "mail_job_history")
data class MailJobHistoryEntryData(
    @Id @GeneratedValue(strategy = GenerationType.SEQUENCE) var id: Long,
    @Column var message: String,
    @Column var timestamp: LocalDateTime,
    @Column var jobId: Long
) : DataObject<MailJobHistoryEntry> {
    override fun convert(): MailJobHistoryEntry {
        return MailJobHistoryEntry(id, message, timestamp)
    }
}
