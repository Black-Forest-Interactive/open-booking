package de.sambalmueslie.openbooking.backend.response.api

import de.sambalmueslie.openbooking.common.AuthCrudAPI
import io.micronaut.security.authentication.Authentication

interface ResponseAPI : AuthCrudAPI<Long, Response, ResponseChangeRequest> {
    companion object {
        const val PERMISSION_READ = "openbooking.response.read"
        const val PERMISSION_WRITE = "openbooking.response.write"
    }

    fun find(auth: Authentication, lang: String, type: ResponseType): Response?
}

