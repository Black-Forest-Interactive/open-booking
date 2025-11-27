package de.sambalmueslie.openbooking.backend.staff.api

import de.sambalmueslie.openbooking.common.BusinessObject

data class StaffMember(
    override val id: Long,
    val firstName: String,
    val lastName: String,
    val email: String,
    val phone: String,
    val mobile: String
) : BusinessObject<Long>
