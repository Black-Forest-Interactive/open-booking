package de.sambalmueslie.openbooking.core.claim.api

import de.sambalmueslie.openbooking.common.Entity
import java.time.LocalDateTime

data class Claim(
    override val id: Long,
    val userId: String,
    val expires: LocalDateTime,
    override val created: LocalDateTime,
    override val updated: LocalDateTime?,
) : Entity<Long>
