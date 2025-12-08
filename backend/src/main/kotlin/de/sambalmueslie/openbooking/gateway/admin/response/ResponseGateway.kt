package de.sambalmueslie.openbooking.gateway.admin.response

import de.sambalmueslie.openbooking.common.checkPermission
import de.sambalmueslie.openbooking.core.response.ResponseService
import de.sambalmueslie.openbooking.core.response.api.ResponseChangeRequest
import de.sambalmueslie.openbooking.core.response.api.ResponseType
import de.sambalmueslie.openbooking.gateway.admin.PERMISSION_RESPONSE_ADMIN
import io.micronaut.data.model.Pageable
import io.micronaut.http.annotation.Body
import io.micronaut.security.authentication.Authentication
import jakarta.inject.Singleton

@Singleton
class ResponseGateway(private val service: ResponseService) {

    fun getAll(auth: Authentication, pageable: Pageable) = auth.checkPermission(PERMISSION_RESPONSE_ADMIN) { service.getAll(pageable) }
    fun get(auth: Authentication, id: Long) = auth.checkPermission(PERMISSION_RESPONSE_ADMIN) { service.get(id) }

    fun create(auth: Authentication, @Body request: ResponseChangeRequest) = auth.checkPermission(PERMISSION_RESPONSE_ADMIN) { service.create(request) }

    fun update(auth: Authentication, id: Long, @Body request: ResponseChangeRequest) = auth.checkPermission(PERMISSION_RESPONSE_ADMIN) { service.update(id, request) }

    fun delete(auth: Authentication, id: Long) = auth.checkPermission(PERMISSION_RESPONSE_ADMIN) { service.delete(id) }

    fun find(auth: Authentication, lang: String, type: ResponseType) = auth.checkPermission(PERMISSION_RESPONSE_ADMIN) { service.find(lang, type) }

}