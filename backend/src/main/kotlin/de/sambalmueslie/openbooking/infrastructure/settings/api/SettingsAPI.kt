package de.sambalmueslie.openbooking.infrastructure.settings.api

import de.sambalmueslie.openbooking.common.AuthCrudAPI
import de.sambalmueslie.openbooking.common.PatchRequest
import io.micronaut.security.authentication.Authentication

interface SettingsAPI : AuthCrudAPI<Long, Setting, SettingChangeRequest> {
    companion object {
        const val SETTINGS_URL_HELP = "url.help"
        const val SETTINGS_URL_TERMS_AND_CONDITIONS = "url.terms-and-conditions"
        const val SETTINGS_TEXT_TITLE = "text.title"
        const val SETTINGS_MAIL_FROM_ADDRESS = "mail.from-address"
        const val SETTINGS_MAIL_REPLY_TO_ADDRESS = "mail.reply-to-address"
        const val SETTINGS_MAIL_DEFAULT_ADMIN_ADDRESS = "mail.default-admin-address"
        const val SETTINGS_CLAIM_TTL = "claim.ttl"
        const val SETTINGS_EDITOR_TTL = "editor.ttl"
        const val SETTINGS_DATE_FORMAT = "format.date"
        const val SETTINGS_TIME_FORMAT = "format.time"
    }

    fun setValue(auth: Authentication, id: Long, value: PatchRequest<Any>): Setting?
    fun findByKey(auth: Authentication, key: String): Setting?
}

