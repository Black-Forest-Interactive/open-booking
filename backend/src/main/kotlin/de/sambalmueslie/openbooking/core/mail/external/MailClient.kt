package de.sambalmueslie.openbooking.core.mail.external

import de.sambalmueslie.openbooking.core.mail.api.Mail
import de.sambalmueslie.openbooking.core.mail.api.MailParticipant

interface MailClient {
    fun send(mail: Mail, from: MailParticipant, to: List<MailParticipant>, bcc: List<MailParticipant> = emptyList()): Boolean
}
