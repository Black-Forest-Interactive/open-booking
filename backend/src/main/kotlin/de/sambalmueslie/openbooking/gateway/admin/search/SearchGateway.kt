package de.sambalmueslie.openbooking.gateway.admin.search

import de.sambalmueslie.openbooking.common.checkPermission
import de.sambalmueslie.openbooking.core.search.SearchService
import de.sambalmueslie.openbooking.gateway.admin.PERMISSION_SEARCH_ADMIN
import io.micronaut.security.authentication.Authentication
import jakarta.inject.Singleton

@Singleton
class SearchGateway(private val service: SearchService) {
    fun getInfo(auth: Authentication) = auth.checkPermission(PERMISSION_SEARCH_ADMIN) {
        service.getInfo()
    }

    fun getInfo(auth: Authentication, key: String) = auth.checkPermission(PERMISSION_SEARCH_ADMIN) {
        service.getInfo(key)
    }

    fun setup(auth: Authentication, key: String) = auth.checkPermission(PERMISSION_SEARCH_ADMIN) {
        service.setup(key)
    }
}