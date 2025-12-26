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

    fun getDailyOffers(auth: Authentication, day: LocalDate, request: DailyOffersFilterRequest?) = auth.checkPermission(PERMISSION_DASHBOARD_ADMIN) {
        val result = sampleData.dailyOffers.find { it.date == day } ?: sampleData.dailyOffers.first()
        result.applyFilter(request)
    }

    private fun DailyOffers.applyFilter(request: DailyOffersFilterRequest?): DailyOffers {
        if (request == null) return this

        val result = offers.mapNotNull { it.applyFilter(request) }
        return DailyOffers(date, result)
    }

    private fun ShowOffer.applyFilter(request: DailyOffersFilterRequest): ShowOffer? {
        if (request.guide.isNotBlank() && !guide.equals(request.guide, true)) return null
        if (request.showName.isNotBlank() && !showName.contains(request.showName, true)) return null
        if (request.status.isNotBlank()) {
            return when (request.status) {
                "pending" -> onlyPending()
                "confirmed" -> onlyConfirmed()
                "no-bookings" -> if (bookings.isEmpty()) this else null
                else -> this
            }
        }
        return this
    }

    private fun ShowOffer.onlyPending(): ShowOffer? {
        return filterBookings { !it.confirmed }
    }

    private fun ShowOffer.onlyConfirmed(): ShowOffer? {
        return filterBookings { it.confirmed }
    }

    private fun ShowOffer.filterBookings(predicate: (Booking) -> Boolean): ShowOffer? {
        val result = bookings.filter(predicate)
        if (result.isNotEmpty()) return null
        return ShowOffer(id, showName, guide, color, timeSlot, totalSeats, result)
    }

}

