package de.sambalmueslie.openbooking.core.dashboard


import de.sambalmueslie.openbooking.core.dashboard.api.DashboardAPI
import de.sambalmueslie.openbooking.core.dashboard.api.DashboardAPI.Companion.PERMISSION_READ
import de.sambalmueslie.openbooking.common.checkPermission
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.micronaut.security.authentication.Authentication
import io.swagger.v3.oas.annotations.tags.Tag

@Controller("/api/backend/dashboard")
@Tag(name = "Dashboard API")
@Deprecated("move that to gateway")
class DashboardController(private val service: DashboardService) : DashboardAPI {

    @Get("/visitor/daily")
    override fun getDailyVisitorStats(auth: Authentication) = auth.checkPermission(PERMISSION_READ) { service.getDailyVisitorStats() }

}
