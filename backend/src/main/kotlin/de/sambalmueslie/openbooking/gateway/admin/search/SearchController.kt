package de.sambalmueslie.openbooking.gateway.admin.search

import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.micronaut.http.annotation.Post
import io.micronaut.security.authentication.Authentication
import io.swagger.v3.oas.annotations.tags.Tag

@Controller("/api/admin/search")
@Tag(name = "Admin Search API")
class SearchController(private val gateway: SearchGateway) {
    @Get()
    fun getInfo(auth: Authentication) = gateway.getInfo(auth)

    @Get("/{key}")
    fun getInfo(auth: Authentication, key: String) = gateway.getInfo(auth)

    @Post("/{key}")
    fun setup(auth: Authentication, key: String) = gateway.setup(auth, key)
}