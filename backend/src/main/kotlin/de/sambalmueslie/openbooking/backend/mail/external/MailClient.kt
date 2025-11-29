package de.sambalmueslie.openbooking.backend.mail.external

import de.sambalmueslie.openbooking.backend.mail.api.Mail
import de.sambalmueslie.openbooking.backend.mail.api.MailParticipant

interface MailClient {
    fun send(mail: Mail, from: MailParticipant, to: List<MailParticipant>, bcc: List<MailParticipant> = emptyList()): Boolean
}
