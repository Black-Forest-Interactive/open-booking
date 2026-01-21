package de.sambalmueslie.openbooking.gateway.admin.dashboard

import de.sambalmueslie.openbooking.core.search.offer.api.OfferSearchRequest
import io.micronaut.http.annotation.Body
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.micronaut.http.annotation.Post
import io.micronaut.security.authentication.Authentication
import io.swagger.v3.oas.annotations.tags.Tag


@Controller("/api/admin/dashboard")
@Tag(name = "Admin Dashboard API")
class DashboardController(private val gateway: DashboardGateway) {

    @Get("/visitor/daily")
    fun getDailyVisitorStats(auth: Authentication) = gateway.getDailyVisitorStats(auth)

    @Get("/summary")
    fun getSummary(auth: Authentication) = gateway.getSummary(auth)

    @Post("/offer")
    fun getDailyOffers(auth: Authentication, @Body request: OfferSearchRequest) = gateway.getDailyOffers(auth, request)
}