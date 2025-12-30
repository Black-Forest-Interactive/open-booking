package de.sambalmueslie.openbooking.infrastructure.mail.api

import de.sambalmueslie.openbooking.common.BusinessObject

data class MailJobContent(
    override val id: Long,
    val mail: de.sambalmueslie.openbooking.infrastructure.mail.api.Mail,
    val from: de.sambalmueslie.openbooking.infrastructure.mail.api.MailParticipant,
    val to: List<de.sambalmueslie.openbooking.infrastructure.mail.api.MailParticipant>,
    val bcc: List<de.sambalmueslie.openbooking.infrastructure.mail.api.MailParticipant> = emptyList()
) : BusinessObject<Long>
