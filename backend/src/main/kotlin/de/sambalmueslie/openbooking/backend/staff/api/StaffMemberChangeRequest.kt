package de.sambalmueslie.openbooking.backend.staff.api


import de.sambalmueslie.openbooking.common.BusinessObjectChangeRequest

data class StaffMemberChangeRequest(
    val firstName: String,
    val lastName: String,
    val email: String,
    val phone: String,
    val mobile: String
) : BusinessObjectChangeRequest
