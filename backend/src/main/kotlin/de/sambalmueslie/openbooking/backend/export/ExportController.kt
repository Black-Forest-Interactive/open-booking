package de.sambalmueslie.openbooking.backend.export


import de.sambalmueslie.openbooking.backend.export.api.ExportAPI
import de.sambalmueslie.openbooking.backend.export.api.ExportAPI.Companion.PERMISSION_READ
import de.sambalmueslie.openbooking.common.checkPermission
import io.micronaut.http.MediaType
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.micronaut.http.annotation.PathVariable
import io.micronaut.http.annotation.Produces
import io.micronaut.security.authentication.Authentication
import io.swagger.v3.oas.annotations.tags.Tag
import java.time.LocalDate

@Controller("/api/backend/export")
@Tag(name = "Export API")
class ExportController(private val service: ExportService) : ExportAPI {

    @Produces(value = [MediaType.APPLICATION_OCTET_STREAM])
    @Get("/daily/{date}/pdf")
    override fun createDailyReportPdf(auth: Authentication, @PathVariable date: LocalDate) =
        auth.checkPermission(PERMISSION_READ) {service.createDailyReportPdf(date)}
    @Produces(value = [MediaType.APPLICATION_OCTET_STREAM])
    @Get("/daily/{date}/excel")
    override fun createDailyReportExcel(auth: Authentication, @PathVariable date: LocalDate) =
        auth.checkPermission(PERMISSION_READ) {service.createDailyReportExcel(date)}
}
