package de.sambalmueslie.openbooking.infrastructure.mail.api

import de.sambalmueslie.openbooking.common.Entity

data class MailJobContent(
    override val id: Long,
    val mail: Mail,
    val from: MailParticipant,
    val to: List<MailParticipant>,
    val bcc: List<MailParticipant> = emptyList()
) : Entity<Long>
