package de.sambalmueslie.openbooking.gateway.admin.statistics

import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.micronaut.security.authentication.Authentication
import io.swagger.v3.oas.annotations.tags.Tag

@Controller("/api/admin/statistics")
@Tag(name = "Admin Statistics API")
class StatisticsController(private val gateway: StatisticsGateway) {
    @Get()
    fun get(auth: Authentication) = gateway.get(auth)
}