package de.sambalmueslie.openbooking.gateway.portal.dashboard

import io.micronaut.http.annotation.*
import io.micronaut.security.annotation.Secured
import io.micronaut.security.rules.SecurityRule
import io.swagger.v3.oas.annotations.tags.Tag
import java.time.LocalDate

@Controller("/api/portal/dashboard")
@Tag(name = "Dashboard API")
@Secured(SecurityRule.IS_ANONYMOUS)
class DashboardController(private val service: DashboardService) {

    @Get()
    fun getDefaultDayInfo() = service.getDefaultDayInfo()

    @Post()
    fun selectDayInfo(@Body request: DashboardEntrySearchRequest) = service.selectDayInfo(request)

    @Get("/{date}")
    fun getDayInfo(@PathVariable date: LocalDate) = service.getDayInfo(date)

}