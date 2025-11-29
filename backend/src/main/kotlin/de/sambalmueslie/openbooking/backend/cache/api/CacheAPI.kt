package de.sambalmueslie.openbooking.backend.cache.api

import io.micronaut.security.authentication.Authentication

interface CacheAPI {
    companion object {
        const val PERMISSION_READ = "openbooking.cache.read"
        const val PERMISSION_WRITE = "openbooking.cache.write"
    }

    fun get(auth: Authentication, key: String): CacheInfo?
    fun getAll(auth: Authentication): List<CacheInfo>

    fun reset(auth: Authentication, key: String): CacheInfo?
    fun resetAll(auth: Authentication): List<CacheInfo>


}
