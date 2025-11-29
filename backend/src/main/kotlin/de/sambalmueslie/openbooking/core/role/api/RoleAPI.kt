package de.sambalmueslie.openbooking.core.role.api

import de.sambalmueslie.openbooking.common.AuthCrudAPI

interface RoleAPI : AuthCrudAPI<Long, TourRole, TourRoleChangeRequest> {
    companion object {
        const val PERMISSION_READ = "openbooking.role.read"
        const val PERMISSION_WRITE = "openbooking.role.write"
    }
}

