package de.sambalmueslie.openbooking.gateway.admin.settings

import de.sambalmueslie.openbooking.common.PatchRequest
import de.sambalmueslie.openbooking.common.checkPermission
import de.sambalmueslie.openbooking.core.settings.SettingsService
import de.sambalmueslie.openbooking.core.settings.api.SettingChangeRequest
import de.sambalmueslie.openbooking.gateway.admin.PERMISSION_SETTINGS_ADMIN
import io.micronaut.data.model.Pageable
import io.micronaut.security.authentication.Authentication
import jakarta.inject.Singleton

@Singleton
class SettingsGateway(private val service: SettingsService) {
    fun get(auth: Authentication, id: Long) = auth.checkPermission(PERMISSION_SETTINGS_ADMIN) {
        service.get(id)
    }

    fun getAll(auth: Authentication, pageable: Pageable) = auth.checkPermission(PERMISSION_SETTINGS_ADMIN) {
        service.getAll(pageable)
    }

    fun create(auth: Authentication, request: SettingChangeRequest) = auth.checkPermission(PERMISSION_SETTINGS_ADMIN) {
        service.create(request)
    }

    fun update(auth: Authentication, id: Long, request: SettingChangeRequest) = auth.checkPermission(PERMISSION_SETTINGS_ADMIN) {
        service.update(id, request)
    }

    fun delete(auth: Authentication, id: Long) = auth.checkPermission(PERMISSION_SETTINGS_ADMIN) {
        service.delete(id)
    }

    fun setValue(auth: Authentication, id: Long, value: PatchRequest<Any>) = auth.checkPermission(PERMISSION_SETTINGS_ADMIN) { service.setValue(id, value.value) }

    fun findByKey(auth: Authentication, key: String) = auth.checkPermission(PERMISSION_SETTINGS_ADMIN) { service.findByKey(key) }

    fun getTitle(auth: Authentication) = auth.checkPermission(PERMISSION_SETTINGS_ADMIN) { service.getTitle() }

    fun getHelpUrl(auth: Authentication) = auth.checkPermission(PERMISSION_SETTINGS_ADMIN) { service.getHelpUrl() }

    fun getTermsAndConditionsUrl(auth: Authentication) = auth.checkPermission(PERMISSION_SETTINGS_ADMIN) { service.getTermsAndConditionsUrl() }

}