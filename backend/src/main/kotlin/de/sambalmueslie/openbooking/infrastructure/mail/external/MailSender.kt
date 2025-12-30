package de.sambalmueslie.openbooking.infrastructure.mail.external


import de.sambalmueslie.openbooking.config.MailConfig
import de.sambalmueslie.openbooking.infrastructure.settings.SettingsService
import de.sambalmueslie.openbooking.infrastructure.settings.api.SettingsAPI
import io.micronaut.context.annotation.Requires
import io.micronaut.context.env.Environment
import jakarta.inject.Singleton
import org.simplejavamail.MailException
import org.simplejavamail.email.EmailBuilder
import org.simplejavamail.mailer.MailerBuilder
import org.slf4j.LoggerFactory

@Singleton
@Requires(notEnv = [Environment.TEST])
class MailSender(
    private val config: MailConfig,
    private val settingsService: SettingsService
) : de.sambalmueslie.openbooking.infrastructure.mail.external.MailClient {

    companion object {
        private val logger = LoggerFactory.getLogger(_root_ide_package_.de.sambalmueslie.openbooking.infrastructure.mail.external.MailSender::class.java)
    }

    private val mailer = MailerBuilder
        .withSMTPServer(config.server, config.port, config.username, config.password)
        .buildMailer()

    override fun send(
        mail: de.sambalmueslie.openbooking.infrastructure.mail.api.Mail,
        from: de.sambalmueslie.openbooking.infrastructure.mail.api.MailParticipant,
        to: List<de.sambalmueslie.openbooking.infrastructure.mail.api.MailParticipant>,
        bcc: List<de.sambalmueslie.openbooking.infrastructure.mail.api.MailParticipant>
    ): Boolean {
        if (logger.isDebugEnabled) logger.debug("Send mail '${mail.subject}' to ${to.joinToString { it.address }}")
        val builder = EmailBuilder.startingBlank()
        to.forEach { builder.to(it.name, it.address) }
        bcc.forEach { builder.bcc(it.name, it.address) }
        builder.withReplyTo(getReplyToAddress())

        builder.withSubject(mail.subject)
        builder.from(from.name, from.address)
        mail.plainText?.let { builder.withPlainText(it) }
        mail.htmlText?.let { builder.withHTMLText(it) }

        val email = builder.buildEmail()
        try {
            mailer.sendMail(email)
        } catch (e: MailException) {
            logger.error("Failed to send mail '${mail.subject}'", e)
            return false
        }
        return true
    }

    private fun getReplyToAddress(): String {
        val settings = settingsService.findByKey(SettingsAPI.SETTINGS_MAIL_REPLY_TO_ADDRESS)

        val value = settings?.value as? String
        if (value.isNullOrBlank()) return config.replyToAddress

        return value
    }
}
