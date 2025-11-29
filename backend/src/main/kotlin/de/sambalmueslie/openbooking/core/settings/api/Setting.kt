package de.sambalmueslie.openbooking.core.settings.api

import de.sambalmueslie.openbooking.common.BusinessObject

data class Setting(
    override val id: Long,
    val key: String,
    val value: Any,
    val type: ValueType
) : BusinessObject<Long>
