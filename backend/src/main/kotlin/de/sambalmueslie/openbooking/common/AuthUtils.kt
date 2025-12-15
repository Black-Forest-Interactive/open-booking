package de.sambalmueslie.openbooking.common

import de.sambalmueslie.openbooking.error.InsufficientPermissionsException
import io.micronaut.security.authentication.Authentication


fun <T> Authentication.checkPermission(permission: String, function: () -> T): T {
    if (roles.contains(permission)) return function.invoke()
    val resourceAccess = attributes["resource_access"] as? Map<String, *>
    val clientAccess = resourceAccess?.get("admin-app") as? Map<String, *>
    val clientRoles = clientAccess?.get("roles") as? List<String>

    if (clientRoles != null) {
        if (clientRoles.contains(permission)) return function.invoke()
    }
    throw InsufficientPermissionsException("No permission to access resource")
}

class AuthUtils {

}

