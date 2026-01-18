package de.sambalmueslie.openbooking.core.guide.api

import de.sambalmueslie.openbooking.common.Entity

data class Guide(
    override val id: Long,
    val firstName: String,
    val lastName: String,
    val email: String,
    val phone: String,
    val mobile: String
) : Entity<Long>
