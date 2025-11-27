package de.sambalmueslie.openbooking.backend.mail.api

import io.micronaut.data.model.Page
import io.micronaut.data.model.Pageable
import io.micronaut.security.authentication.Authentication

interface MailAPI {
    companion object {
        const val PERMISSION_READ = "openbooking.mail.read"
        const val PERMISSION_WRITE = "openbooking.mail.write"
    }

    fun getJobs(auth: Authentication, pageable: Pageable): Page<MailJob>
    fun getFailedJobs(auth: Authentication, pageable: Pageable): Page<MailJob>

    fun getJobHistory(auth: Authentication, jobId: Long, pageable: Pageable): Page<MailJobHistoryEntry>

    fun reRunJob(auth: Authentication,  jobId: Long)
}
