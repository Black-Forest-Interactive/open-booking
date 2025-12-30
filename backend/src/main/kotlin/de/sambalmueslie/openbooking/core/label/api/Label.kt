package de.sambalmueslie.openbooking.core.label.api

import de.sambalmueslie.openbooking.common.BusinessObject

data class Label(
    override val id: Long,
    val name: String,
    val color: String,
    val priority: Int,
) : BusinessObject<Long>
