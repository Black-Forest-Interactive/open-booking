package de.sambalmueslie.openbooking.gateway.admin.info

import de.sambalmueslie.openbooking.common.checkPermission
import de.sambalmueslie.openbooking.core.info.InfoService
import de.sambalmueslie.openbooking.core.info.api.DateRangeSelectionRequest
import de.sambalmueslie.openbooking.gateway.admin.PERMISSION_INFO_ADMIN
import io.micronaut.http.annotation.Body
import io.micronaut.security.authentication.Authentication
import jakarta.inject.Singleton
import java.time.LocalDate

@Singleton
class InfoGateway(private val service: InfoService) {
    fun getDayInfo(auth: Authentication, date: LocalDate) = auth.checkPermission(PERMISSION_INFO_ADMIN) { service.getDayInfo(date) }
    fun getDayInfoRange(auth: Authentication, @Body request: DateRangeSelectionRequest) = auth.checkPermission(PERMISSION_INFO_ADMIN) { service.getDayInfoRange(request) }
}