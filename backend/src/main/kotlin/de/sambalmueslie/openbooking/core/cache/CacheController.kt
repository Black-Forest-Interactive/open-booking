package de.sambalmueslie.openbooking.core.cache


import de.sambalmueslie.openbooking.core.cache.api.CacheAPI
import de.sambalmueslie.openbooking.core.cache.api.CacheAPI.Companion.PERMISSION_READ
import de.sambalmueslie.openbooking.core.cache.api.CacheAPI.Companion.PERMISSION_WRITE
import de.sambalmueslie.openbooking.common.checkPermission
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Delete
import io.micronaut.http.annotation.Get
import io.micronaut.http.annotation.PathVariable
import io.micronaut.security.authentication.Authentication
import io.swagger.v3.oas.annotations.tags.Tag

@Controller("/api/backend/cache")
@Tag(name = "Cache API")
@Deprecated("move that to gateway")
class CacheController(private val service: CacheService) : CacheAPI {

    @Get("/{key}")
    override fun get(auth: Authentication, @PathVariable key: String) = auth.checkPermission(PERMISSION_READ) { service.get(key) }

    @Get()
    override fun getAll(auth: Authentication) = auth.checkPermission(PERMISSION_READ) { service.getAll() }

    @Delete("/{key}")
    override fun reset(auth: Authentication, @PathVariable key: String) = auth.checkPermission(PERMISSION_WRITE) { service.reset(key) }

    @Delete()
    override fun resetAll(auth: Authentication)= auth.checkPermission(PERMISSION_WRITE) { service.resetAll() }


}
