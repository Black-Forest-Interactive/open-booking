package de.sambalmueslie.openbooking.gateway.portal.settings

import de.sambalmueslie.openbooking.core.settings.SettingsService
import de.sambalmueslie.openbooking.core.settings.api.SettingsAPI
import de.sambalmueslie.openbooking.frontend.user.api.TextResponse
import de.sambalmueslie.openbooking.frontend.user.api.UrlResponse
import jakarta.inject.Singleton

@Singleton
class SettingsService(private val settingsService: SettingsService) {
    fun getTitle(): TextResponse {
        return TextResponse(getValue(SettingsAPI.SETTINGS_TEXT_TITLE))
    }

    fun getHelpUrl(): UrlResponse {
        return UrlResponse(getValue(SettingsAPI.SETTINGS_URL_HELP))
    }

    fun getTermsAndConditionsUrl(): UrlResponse {
        return UrlResponse(getValue(SettingsAPI.SETTINGS_URL_TERMS_AND_CONDITIONS))
    }

    private fun getValue(key: String): String {
        return settingsService.findByKey(key)?.value as? String ?: ""
    }
}