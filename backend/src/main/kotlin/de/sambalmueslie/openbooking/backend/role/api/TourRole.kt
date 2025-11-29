package de.sambalmueslie.openbooking.backend.role.api

import de.sambalmueslie.openbooking.common.BusinessObject

data class TourRole(
    override val id: Long,
    val name: String,
    val description: String
) : BusinessObject<Long>
