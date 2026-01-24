package de.sambalmueslie.openbooking.core.label.api

import de.sambalmueslie.openbooking.common.Entity
import java.time.LocalDateTime

data class Label(
    override val id: Long,
    val name: String,
    val color: String,
    val priority: Int,
    override val created: LocalDateTime,
    override val updated: LocalDateTime?,
) : Entity<Long>
