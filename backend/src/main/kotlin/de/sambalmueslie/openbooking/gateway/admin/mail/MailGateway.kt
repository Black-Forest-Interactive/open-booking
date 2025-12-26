package de.sambalmueslie.openbooking.gateway.admin.mail

import de.sambalmueslie.openbooking.common.checkPermission
import de.sambalmueslie.openbooking.core.mail.MailService
import de.sambalmueslie.openbooking.gateway.admin.PERMISSION_MAIL_ADMIN
import io.micronaut.data.model.Pageable
import io.micronaut.security.authentication.Authentication
import jakarta.inject.Singleton

@Singleton
class MailGateway(private val service: MailService) {

    fun getJobs(auth: Authentication, pageable: Pageable) = auth.checkPermission(PERMISSION_MAIL_ADMIN) { service.getJobs(pageable) }

    fun getFailedJobs(auth: Authentication, pageable: Pageable) = auth.checkPermission(PERMISSION_MAIL_ADMIN) { service.getFailedJobs(pageable) }

    fun getJobHistory(auth: Authentication, jobId: Long, pageable: Pageable) = auth.checkPermission(PERMISSION_MAIL_ADMIN) { service.getJobHistory(jobId, pageable) }

    fun reRunJob(auth: Authentication, jobId: Long) = auth.checkPermission(PERMISSION_MAIL_ADMIN) { service.reRunJob(jobId) }


}