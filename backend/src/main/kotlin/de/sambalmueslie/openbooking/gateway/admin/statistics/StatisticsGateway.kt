package de.sambalmueslie.openbooking.gateway.admin.statistics

import de.sambalmueslie.openbooking.common.checkPermission
import de.sambalmueslie.openbooking.core.statistics.StatisticsService
import de.sambalmueslie.openbooking.gateway.admin.PERMISSION_STATISTICS_ADMIN
import io.micronaut.security.authentication.Authentication
import jakarta.inject.Singleton

@Singleton
class StatisticsGateway(private val service: StatisticsService) {
    fun get(auth: Authentication) = auth.checkPermission(PERMISSION_STATISTICS_ADMIN) { service.get() }
}