package de.sambalmueslie.openbooking.infrastructure.mail.api

data class MailJobContent(
    val id: Long,
    val mail: Mail,
    val from: MailParticipant,
    val to: List<MailParticipant>,
    val bcc: List<MailParticipant> = emptyList(),
)
