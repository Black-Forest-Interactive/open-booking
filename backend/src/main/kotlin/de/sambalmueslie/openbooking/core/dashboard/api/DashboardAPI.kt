package de.sambalmueslie.openbooking.core.dashboard.api

import io.micronaut.security.authentication.Authentication

interface DashboardAPI {
    companion object {
        const val PERMISSION_READ = "openbooking.dashboard.read"
        const val PERMISSION_WRITE = "openbooking.dashboard.write"
    }

    fun getDailyVisitorStats(auth: Authentication): List<DailyVisitorStats>
}
