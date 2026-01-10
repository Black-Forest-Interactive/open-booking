package de.sambalmueslie.openbooking.core.claim.api

import de.sambalmueslie.openbooking.common.BusinessObject
import java.time.LocalDateTime

data class Claim(
    override val id: Long,
    val userId: String,
    val expires: LocalDateTime
) : BusinessObject<Long>
