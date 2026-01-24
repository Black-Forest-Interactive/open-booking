package de.sambalmueslie.openbooking.gateway.admin.dashboard

import de.sambalmueslie.openbooking.common.checkPermission
import de.sambalmueslie.openbooking.core.dashboard.DashboardService
import de.sambalmueslie.openbooking.core.search.offer.api.OfferSearchRequest
import de.sambalmueslie.openbooking.gateway.admin.PERMISSION_DASHBOARD_ADMIN
import io.micronaut.security.authentication.Authentication
import jakarta.inject.Singleton
import java.time.LocalDate

@Singleton
class DashboardGateway(private val service: DashboardService) {

    fun getDailyVisitorStats(auth: Authentication) = auth.checkPermission(PERMISSION_DASHBOARD_ADMIN) { service.getDailyVisitorStats() }

    fun getWeeksSummary(auth: Authentication) = auth.checkPermission(PERMISSION_DASHBOARD_ADMIN) { service.getWeeksSummary() }
    fun getDaySummary(auth: Authentication, from: LocalDate, to: LocalDate) = auth.checkPermission(PERMISSION_DASHBOARD_ADMIN) { service.getDaySummary(from, to) }

    fun getDailyOffers(auth: Authentication, request: OfferSearchRequest) = auth.checkPermission(PERMISSION_DASHBOARD_ADMIN) { service.getDailyOffers(request) }

}

