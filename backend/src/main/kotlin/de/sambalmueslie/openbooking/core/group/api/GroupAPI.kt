package de.sambalmueslie.openbooking.core.group.api

import de.sambalmueslie.openbooking.common.AuthCrudAPI
import io.micronaut.security.authentication.Authentication

interface GroupAPI : AuthCrudAPI<Long, VisitorGroup, VisitorGroupChangeRequest> {
    companion object {
        const val PERMISSION_GROUP_READ = "openbooking.group.read"
        const val PERMISSION_GROUP_WRITE = "openbooking.group.write"
    }
    fun confirm(auth: Authentication, id: Long): VisitorGroup?

}
