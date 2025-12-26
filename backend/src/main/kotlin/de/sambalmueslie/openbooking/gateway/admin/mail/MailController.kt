package de.sambalmueslie.openbooking.gateway.admin.mail

import io.micronaut.data.model.Pageable
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.micronaut.http.annotation.Post
import io.micronaut.security.authentication.Authentication
import io.swagger.v3.oas.annotations.tags.Tag


@Controller("/api/admin/mail")
@Tag(name = "Admin Mail API")
class MailController(private val gateway: MailGateway) {
    @Get()
    fun getJobs(auth: Authentication, pageable: Pageable) = gateway.getJobs(auth, pageable)

    @Get("/failed")
    fun getFailedJobs(auth: Authentication, pageable: Pageable) = gateway.getFailedJobs(auth, pageable)

    @Get("/{jobId}/history")
    fun getJobHistory(auth: Authentication, jobId: Long, pageable: Pageable) = gateway.getJobHistory(auth, jobId, pageable)

    @Post("/{jobId}")
    fun reRunJob(auth: Authentication, jobId: Long) = gateway.reRunJob(auth, jobId)
}