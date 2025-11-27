package de.sambalmueslie.openbooking.common

import de.sambalmueslie.openbooking.error.InsufficientPermissionsException
import io.micronaut.security.authentication.Authentication


fun <T> Authentication.checkPermission(permission: String, function: () -> T): T {
    if (roles.contains(permission)) return function.invoke()
    val permissions = attributes["permissions"]
    if (permissions != null) {
        val values = permissions as? List<*> ?:  throw InsufficientPermissionsException("No permission to access resource")
        if (values.contains(permission)) return function.invoke()
    }
    throw InsufficientPermissionsException("No permission to access resource")
}

class AuthUtils {

}

