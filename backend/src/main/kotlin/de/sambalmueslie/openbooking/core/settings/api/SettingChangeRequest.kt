package de.sambalmueslie.openbooking.core.settings.api

import de.sambalmueslie.openbooking.common.BusinessObjectChangeRequest

data class SettingChangeRequest(
    val key: String,
    val value: Any,
    val type: ValueType
) : BusinessObjectChangeRequest
