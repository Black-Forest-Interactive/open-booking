package de.sambalmueslie.openbooking.gateway.portal.dashboard

import io.micronaut.http.annotation.Body
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.micronaut.http.annotation.Post
import io.micronaut.security.annotation.Secured
import io.micronaut.security.rules.SecurityRule
import io.swagger.v3.oas.annotations.tags.Tag
import java.time.LocalDate

@Controller("/api/portal/dashboard")
@Tag(name = "Dashboard API")
@Secured(SecurityRule.IS_ANONYMOUS)
class DashboardController(private val service: DashboardService) {

    @Post()
    fun search(@Body request: DashboardEntrySearchRequest) = service.search(request)

    @Get("/{date}")
    fun getDayInfo(date: LocalDate) = service.getDayInfo(date)

}