package de.sambalmueslie.openbooking.gateway.admin.cache

import de.sambalmueslie.openbooking.common.checkPermission
import de.sambalmueslie.openbooking.core.cache.CacheService
import de.sambalmueslie.openbooking.gateway.admin.PERMISSION_CACHE_ADMIN
import io.micronaut.security.authentication.Authentication
import jakarta.inject.Singleton

@Singleton
class CacheGateway(private val service: CacheService) {
    fun get(auth: Authentication, key: String) = auth.checkPermission(PERMISSION_CACHE_ADMIN) { service.get(key) }
    fun getAll(auth: Authentication) = auth.checkPermission(PERMISSION_CACHE_ADMIN) { service.getAll() }
    fun reset(auth: Authentication, key: String) = auth.checkPermission(PERMISSION_CACHE_ADMIN) { service.reset(key) }
    fun resetAll(auth: Authentication) = auth.checkPermission(PERMISSION_CACHE_ADMIN) { service.resetAll() }
}