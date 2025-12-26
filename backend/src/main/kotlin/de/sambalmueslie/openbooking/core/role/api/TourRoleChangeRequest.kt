package de.sambalmueslie.openbooking.core.role.api

import de.sambalmueslie.openbooking.common.BusinessObjectChangeRequest

data class TourRoleChangeRequest(
    val name: String,
    val description: String
) : BusinessObjectChangeRequest

