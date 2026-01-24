package de.sambalmueslie.openbooking.gateway.admin.dashboard

import de.sambalmueslie.openbooking.core.search.offer.api.OfferSearchRequest
import io.micronaut.http.annotation.*
import io.micronaut.security.authentication.Authentication
import io.swagger.v3.oas.annotations.tags.Tag
import java.time.LocalDate


@Controller("/api/admin/dashboard")
@Tag(name = "Admin Dashboard API")
class DashboardController(private val gateway: DashboardGateway) {

    @Get("/visitor/daily")
    fun getDailyVisitorStats(auth: Authentication) = gateway.getDailyVisitorStats(auth)

    @Get("/summary/week")
    fun getWeeksSummary(auth: Authentication) = gateway.getWeeksSummary(auth)


    @Get("/summary/day")
    fun getDaySummary(auth: Authentication, @QueryValue from: LocalDate, @QueryValue to: LocalDate) = gateway.getDaySummary(auth, from, to)

    @Post("/offer")
    fun getDailyOffers(auth: Authentication, @Body request: OfferSearchRequest) = gateway.getDailyOffers(auth, request)
}