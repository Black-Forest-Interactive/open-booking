package de.sambalmueslie.openbooking.infrastructure.mail.external

import de.sambalmueslie.openbooking.infrastructure.mail.api.Mail
import de.sambalmueslie.openbooking.infrastructure.mail.api.MailParticipant

interface MailClient {
    fun send(
        mail: Mail,
        from: MailParticipant,
        to: List<MailParticipant>,
        bcc: List<MailParticipant> = emptyList()
    ): Boolean
}
