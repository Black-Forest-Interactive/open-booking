package de.sambalmueslie.openbooking.backend.mail.api

import de.sambalmueslie.openbooking.common.BusinessObject

data class MailJobContent(
    override val id: Long,
    val mail: Mail,
    val from: MailParticipant,
    val to: List<MailParticipant>,
    val bcc: List<MailParticipant> = emptyList()
): BusinessObject<Long>
