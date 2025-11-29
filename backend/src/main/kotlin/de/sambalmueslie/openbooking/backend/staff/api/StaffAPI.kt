package de.sambalmueslie.openbooking.backend.staff.api

import de.sambalmueslie.openbooking.common.AuthCrudAPI

interface StaffAPI : AuthCrudAPI<Long, StaffMember, StaffMemberChangeRequest> {
    companion object {
        const val PERMISSION_READ = "openbooking.staff.read"
        const val PERMISSION_WRITE = "openbooking.staff.write"
    }
}

