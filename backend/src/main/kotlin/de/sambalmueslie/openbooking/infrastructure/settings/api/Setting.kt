package de.sambalmueslie.openbooking.infrastructure.settings.api

import de.sambalmueslie.openbooking.common.Entity

data class Setting(
    override val id: Long,
    val key: String,
    val value: Any,
    val type: ValueType
) : Entity<Long>
