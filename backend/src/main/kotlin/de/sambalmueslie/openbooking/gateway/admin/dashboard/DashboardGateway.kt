package de.sambalmueslie.openbooking.gateway.admin.dashboard

import de.sambalmueslie.openbooking.common.checkPermission
import de.sambalmueslie.openbooking.core.dashboard.DashboardService
import de.sambalmueslie.openbooking.gateway.admin.PERMISSION_DASHBOARD_ADMIN
import io.micronaut.security.authentication.Authentication
import jakarta.inject.Singleton
import java.time.LocalDate

@Singleton
class DashboardGateway(
    private val service: DashboardService,
) {

    fun getDailyVisitorStats(auth: Authentication) = auth.checkPermission(PERMISSION_DASHBOARD_ADMIN) { service.getDailyVisitorStats() }


    private val sampleData = generateSampleCalendarData()

    fun getSummary(auth: Authentication) = auth.checkPermission(PERMISSION_DASHBOARD_ADMIN) {
        sampleData.weeks
    }

    fun getDailyOffers(auth: Authentication, day: LocalDate) = auth.checkPermission(PERMISSION_DASHBOARD_ADMIN) {
        sampleData.dailyOffers.find { it.date == day } ?: sampleData.dailyOffers.first()
    }
}