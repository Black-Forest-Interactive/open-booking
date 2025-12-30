package de.sambalmueslie.openbooking.infrastructure.mail.external

interface MailClient {
    fun send(
        mail: de.sambalmueslie.openbooking.infrastructure.mail.api.Mail,
        from: de.sambalmueslie.openbooking.infrastructure.mail.api.MailParticipant,
        to: List<de.sambalmueslie.openbooking.infrastructure.mail.api.MailParticipant>,
        bcc: List<de.sambalmueslie.openbooking.infrastructure.mail.api.MailParticipant> = emptyList()
    ): Boolean
}
