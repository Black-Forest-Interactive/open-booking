@file:Suppress("PropertyName")

package de.sambalmueslie.openbooking.infrastructure.mail.db

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import de.sambalmueslie.openbooking.common.DataObject
import jakarta.persistence.*

@Entity(name = "MailJobContent")
@Table(name = "mail_job_content")
data class MailJobContentData(
    @Id @GeneratedValue var id: Long,
    @Column var mailJson: String,
    @Column var fromJson: String,
    @Column var toJson: String,
    @Column var bccJson: String,
    @Column(unique = true) var jobId: Long,
) : DataObject<de.sambalmueslie.openbooking.infrastructure.mail.api.MailJobContent> {


    companion object {
        private val mapper = ObjectMapper()

        fun create(
            mail: de.sambalmueslie.openbooking.infrastructure.mail.api.Mail,
            from: de.sambalmueslie.openbooking.infrastructure.mail.api.MailParticipant,
            to: List<de.sambalmueslie.openbooking.infrastructure.mail.api.MailParticipant>,
            bcc: List<de.sambalmueslie.openbooking.infrastructure.mail.api.MailParticipant>,
            jobId: Long
        ): de.sambalmueslie.openbooking.infrastructure.mail.db.MailJobContentData {
            val m = mapper.writeValueAsString(mail)
            val f = mapper.writeValueAsString(from)
            val t = mapper.writeValueAsString(to)
            val b = mapper.writeValueAsString(bcc)
            val data = _root_ide_package_.de.sambalmueslie.openbooking.infrastructure.mail.db.MailJobContentData(0, m, f, t, b, jobId)
            data.mail = mail
            data.from = from
            data.to = to
            data.bcc = bcc
            return data
        }
    }

    override fun convert(): de.sambalmueslie.openbooking.infrastructure.mail.api.MailJobContent {
        return _root_ide_package_.de.sambalmueslie.openbooking.infrastructure.mail.api.MailJobContent(id, getMailObj(), getFromObj(), getToObj(), getBccObj())
    }

    @Transient
    private var mail: de.sambalmueslie.openbooking.infrastructure.mail.api.Mail? = null

    @Transient
    fun getMailObj(): de.sambalmueslie.openbooking.infrastructure.mail.api.Mail {
        if (mail == null) {
            mail =
                _root_ide_package_.de.sambalmueslie.openbooking.infrastructure.mail.db.MailJobContentData.Companion.mapper.readValue<de.sambalmueslie.openbooking.infrastructure.mail.api.Mail>(mailJson)
        }
        return mail!!
    }

    @Transient
    private var from: de.sambalmueslie.openbooking.infrastructure.mail.api.MailParticipant? = null

    @Transient
    fun getFromObj(): de.sambalmueslie.openbooking.infrastructure.mail.api.MailParticipant {
        if (from == null) {
            from =
                _root_ide_package_.de.sambalmueslie.openbooking.infrastructure.mail.db.MailJobContentData.Companion.mapper.readValue<de.sambalmueslie.openbooking.infrastructure.mail.api.MailParticipant>(
                    fromJson
                )
        }
        return from!!
    }

    @Transient
    private var to: List<de.sambalmueslie.openbooking.infrastructure.mail.api.MailParticipant>? = null

    @Transient
    fun getToObj(): List<de.sambalmueslie.openbooking.infrastructure.mail.api.MailParticipant> {
        if (to == null) {
            to =
                _root_ide_package_.de.sambalmueslie.openbooking.infrastructure.mail.db.MailJobContentData.Companion.mapper.readValue<List<de.sambalmueslie.openbooking.infrastructure.mail.api.MailParticipant>>(
                    toJson
                )
        }
        return to ?: emptyList()
    }

    @Transient
    private var bcc: List<de.sambalmueslie.openbooking.infrastructure.mail.api.MailParticipant>? = null

    @Transient
    fun getBccObj(): List<de.sambalmueslie.openbooking.infrastructure.mail.api.MailParticipant> {
        if (bcc == null) {
            bcc =
                _root_ide_package_.de.sambalmueslie.openbooking.infrastructure.mail.db.MailJobContentData.Companion.mapper.readValue<List<de.sambalmueslie.openbooking.infrastructure.mail.api.MailParticipant>>(
                    bccJson
                )
        }
        return bcc ?: emptyList()
    }


}
