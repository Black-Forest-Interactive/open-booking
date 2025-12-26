package de.sambalmueslie.openbooking.gateway.admin.export

import io.micronaut.http.MediaType
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.micronaut.http.annotation.Produces
import io.micronaut.security.authentication.Authentication
import io.swagger.v3.oas.annotations.tags.Tag
import java.time.LocalDate


@Controller("/api/admin/export")
@Tag(name = "Admin Export API")
class ExportController(private val gateway: ExportGateway) {
    @Produces(value = [MediaType.APPLICATION_OCTET_STREAM])
    @Get("/daily/{date}/pdf")
    fun createDailyReportPdf(auth: Authentication, date: LocalDate) = gateway.createDailyReportPdf(auth, date)

    @Produces(value = [MediaType.APPLICATION_OCTET_STREAM])
    @Get("/daily/{date}/excel")
    fun createDailyReportExcel(auth: Authentication, date: LocalDate) = gateway.createDailyReportExcel(auth, date)
}