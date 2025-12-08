package de.sambalmueslie.openbooking.gateway.admin.cache

import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Delete
import io.micronaut.http.annotation.Get
import io.micronaut.security.authentication.Authentication
import io.swagger.v3.oas.annotations.tags.Tag


@Controller("/api/admin/cache")
@Tag(name = "Admin Cache API")
class CacheController(private val gateway: CacheGateway) {
    @Get("/{key}")
    fun get(auth: Authentication, key: String) = gateway.get(auth, key)

    @Get()
    fun getAll(auth: Authentication) = gateway.getAll(auth)

    @Delete("/{key}")
    fun reset(auth: Authentication, key: String) = gateway.reset(auth, key)

    @Delete()
    fun resetAll(auth: Authentication) = gateway.resetAll(auth)
}