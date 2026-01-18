package de.sambalmueslie.openbooking.core.label.api

import de.sambalmueslie.openbooking.common.Entity

data class Label(
    override val id: Long,
    val name: String,
    val color: String,
    val priority: Int,
) : Entity<Long>
