package de.sambalmueslie.openbooking.core.label.api

import de.sambalmueslie.openbooking.common.BusinessObjectChangeRequest

data class LabelChangeRequest(
    val name: String,
    val color: String,
    val priority: Int,
) : BusinessObjectChangeRequest
