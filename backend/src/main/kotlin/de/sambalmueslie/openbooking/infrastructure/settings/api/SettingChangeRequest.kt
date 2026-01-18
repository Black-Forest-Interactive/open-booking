package de.sambalmueslie.openbooking.infrastructure.settings.api

import de.sambalmueslie.openbooking.common.EntityChangeRequest

data class SettingChangeRequest(
    val key: String,
    val value: Any,
    val type: ValueType
) : EntityChangeRequest
