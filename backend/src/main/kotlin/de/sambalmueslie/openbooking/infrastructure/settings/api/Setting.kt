package de.sambalmueslie.openbooking.infrastructure.settings.api

import de.sambalmueslie.openbooking.common.Entity
import java.time.LocalDateTime

data class Setting(
    override val id: Long,
    val key: String,
    val value: Any,
    val type: ValueType,
    override val created: LocalDateTime,
    override val updated: LocalDateTime?,
) : Entity<Long>
