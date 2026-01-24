package de.sambalmueslie.openbooking.core.offer.api

import de.sambalmueslie.openbooking.common.Entity
import java.time.LocalDateTime

data class Offer(
    override val id: Long,
    val start: LocalDateTime,
    val finish: LocalDateTime,
    val maxPersons: Int,
    val active: Boolean,
    override val created: LocalDateTime,
    override val updated: LocalDateTime?,
) : Entity<Long>
