package de.sambalmueslie.openbooking.backend.dashboard


import de.sambalmueslie.openbooking.backend.dashboard.api.DashboardAPI
import de.sambalmueslie.openbooking.backend.dashboard.api.DashboardAPI.Companion.PERMISSION_READ
import de.sambalmueslie.openbooking.common.checkPermission
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.micronaut.security.authentication.Authentication

@Controller("/api/backend/dashboard")
class DashboardController(private val service: DashboardService) : DashboardAPI {

    @Get("/visitor/daily")
    override fun getDailyVisitorStats(auth: Authentication) = auth.checkPermission(PERMISSION_READ) { service.getDailyVisitorStats() }

}
