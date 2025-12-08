package de.sambalmueslie.openbooking.gateway.admin.export

import de.sambalmueslie.openbooking.common.checkPermission
import de.sambalmueslie.openbooking.core.export.ExportService
import de.sambalmueslie.openbooking.gateway.admin.PERMISSION_EXPORT_ADMIN
import io.micronaut.security.authentication.Authentication
import jakarta.inject.Singleton
import java.time.LocalDate

@Singleton
class ExportGateway(private val service: ExportService) {
    fun createDailyReportPdf(auth: Authentication, date: LocalDate) =
        auth.checkPermission(PERMISSION_EXPORT_ADMIN) { service.createDailyReportPdf(date) }

    fun createDailyReportExcel(auth: Authentication, date: LocalDate) =
        auth.checkPermission(PERMISSION_EXPORT_ADMIN) { service.createDailyReportExcel(date) }
}