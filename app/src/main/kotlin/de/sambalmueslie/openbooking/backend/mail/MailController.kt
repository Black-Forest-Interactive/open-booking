package de.sambalmueslie.openbooking.backend.mail


import de.sambalmueslie.openbooking.backend.mail.api.MailAPI
import de.sambalmueslie.openbooking.backend.mail.api.MailAPI.Companion.PERMISSION_READ
import de.sambalmueslie.openbooking.backend.mail.api.MailAPI.Companion.PERMISSION_WRITE
import de.sambalmueslie.openbooking.common.checkPermission
import io.micronaut.data.model.Pageable
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.micronaut.http.annotation.Post
import io.micronaut.security.authentication.Authentication
import io.swagger.v3.oas.annotations.tags.Tag

@Controller("/api/backend/mail")
@Tag(name = "Mail API")
class MailController(private val service: MailService) : MailAPI {

    @Get()
    override fun getJobs(auth: Authentication, pageable: Pageable) =
        auth.checkPermission(PERMISSION_READ) { service.getJobs(pageable) }

    @Get("/failed")
    override fun getFailedJobs(auth: Authentication, pageable: Pageable) =
        auth.checkPermission(PERMISSION_READ) { service.getFailedJobs(pageable) }

    @Get("/{jobId}/history")
    override fun getJobHistory(auth: Authentication, jobId: Long, pageable: Pageable) =
        auth.checkPermission(PERMISSION_READ) { service.getJobHistory(jobId, pageable) }

    @Post("/{jobId}")
    override fun reRunJob(auth: Authentication, jobId: Long) =
        auth.checkPermission(PERMISSION_WRITE) { service.reRunJob(jobId) }


}
