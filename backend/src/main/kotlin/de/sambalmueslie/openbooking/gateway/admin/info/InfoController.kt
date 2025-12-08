package de.sambalmueslie.openbooking.gateway.admin.info

import de.sambalmueslie.openbooking.core.info.api.DateRangeSelectionRequest
import io.micronaut.http.annotation.Body
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.micronaut.http.annotation.Post
import io.micronaut.security.authentication.Authentication
import io.swagger.v3.oas.annotations.tags.Tag
import java.time.LocalDate


@Controller("/api/admin/info")
@Tag(name = "Admin Info API")
class InfoController(private val gateway: InfoGateway) {
    @Get("/day/{date}")
    fun getDayInfo(auth: Authentication, date: LocalDate) = gateway.getDayInfo(auth, date)

    @Post("/day")
    fun getDayInfoRange(auth: Authentication, @Body request: DateRangeSelectionRequest) = gateway.getDayInfoRange(auth, request)

}