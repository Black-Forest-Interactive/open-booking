package de.sambalmueslie.openbooking.gateway.portal.settings

import de.sambalmueslie.openbooking.infrastructure.settings.SettingsService
import jakarta.inject.Singleton
import org.slf4j.LoggerFactory

@Singleton
class SettingsGateway(private val service: SettingsService) {

    companion object {
        private val logger = LoggerFactory.getLogger(SettingsGateway::class.java)
    }

    fun getTitle() = service.getTitle()

    fun getHelpUrl() = service.getHelpUrl()

    fun getTermsAndConditionsUrl() = service.getTermsAndConditionsUrl()
}