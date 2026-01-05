package de.sambalmueslie.openbooking.core.notification.processor


import de.sambalmueslie.openbooking.config.MailConfig
import de.sambalmueslie.openbooking.core.notification.NotificationTemplateEvaluator
import de.sambalmueslie.openbooking.core.notification.api.NotificationEvent
import de.sambalmueslie.openbooking.core.notification.api.NotificationEventType
import de.sambalmueslie.openbooking.core.notification.api.NotificationTemplateType
import de.sambalmueslie.openbooking.core.notification.handler.BookingRequestChangeHandler
import de.sambalmueslie.openbooking.core.request.BookingRequestService
import de.sambalmueslie.openbooking.core.request.api.BookingConfirmationContent
import de.sambalmueslie.openbooking.core.request.api.BookingRequest
import de.sambalmueslie.openbooking.core.request.api.BookingRequestInfo
import de.sambalmueslie.openbooking.core.visitor.api.VerificationStatus
import de.sambalmueslie.openbooking.infrastructure.settings.SettingsService
import de.sambalmueslie.openbooking.infrastructure.settings.api.SettingsAPI
import jakarta.inject.Singleton
import org.slf4j.LoggerFactory

@Singleton
@Deprecated("use reservation instead.", ReplaceWith("reservation"))
class BookingRequestEventProcessor(
    private val service: BookingRequestService,
    private val evaluator: NotificationTemplateEvaluator,
    private val mailService: de.sambalmueslie.openbooking.infrastructure.mail.MailService,
    private val settingsService: SettingsService,
    private val config: MailConfig
) : NotificationEventProcessor {

    companion object {
        private val logger = LoggerFactory.getLogger(BookingRequestEventProcessor::class.java)
    }

    override fun process(event: NotificationEvent) {
        if (event.sourceType != BookingRequest::class) return
        when (event.type) {
            NotificationEventType.OBJ_CREATED -> handleCreated(event)
            NotificationEventType.CUSTOM -> handleCustom(event)
            else -> return
        }
    }

    private fun handleCustom(event: NotificationEvent) {
        val type = event.parameter[BookingRequestChangeHandler.TYPE_KEY] ?: return logger.warn("Cannot find ${BookingRequestChangeHandler.TYPE_KEY} on custom notification event")

        val info = service.info(event.sourceId) ?: return
        val content = event.parameter[BookingRequestChangeHandler.CONTENT] as? BookingConfirmationContent ?: return
        when (type) {
            BookingRequestChangeHandler.TYPE_CONFIRMED -> notifyContactOnConfirmed(info, content)
            BookingRequestChangeHandler.TYPE_DENIED -> notifyContactOnDenied(info, content)
        }
    }


    private fun handleCreated(event: NotificationEvent) {
        val info = service.info(event.sourceId) ?: return
        val url = if (info.visitor.verification.status == VerificationStatus.CONFIRMED) "" else service.getConfirmationUrl(event.sourceId)

        val properties = mapOf(
            Pair("info", info),
            Pair("url", url)
        )

        notifyContactOnCreated(properties, info)
        notifyAdminsOnCreated(properties)
    }

    private fun notifyAdminsOnCreated(properties: Map<String, Any>) {
        val mails = evaluator.evaluate(NotificationTemplateType.BOOKING_REQUEST_CREATED_ADMIN, properties)
        val from = _root_ide_package_.de.sambalmueslie.openbooking.infrastructure.mail.api.MailParticipant("", getFromAddress())
        val to = listOf(_root_ide_package_.de.sambalmueslie.openbooking.infrastructure.mail.api.MailParticipant("", getDefaultAdminAddress()))
        mails.forEach { mailService.send(it, from, to) }

    }

    private fun notifyContactOnCreated(properties: Map<String, Any>, info: BookingRequestInfo) {
        val mails = evaluator.evaluate(NotificationTemplateType.BOOKING_REQUEST_CREATED_CONTACT, properties)
        notifyContact(mails, info)
    }

    private fun notifyContactOnConfirmed(info: BookingRequestInfo, content: BookingConfirmationContent) {
        val mails = listOf(_root_ide_package_.de.sambalmueslie.openbooking.infrastructure.mail.api.Mail(content.subject, content.content, null))
        notifyContact(mails, info)
    }

    private fun notifyContactOnDenied(info: BookingRequestInfo, content: BookingConfirmationContent) {
        val mails = listOf(_root_ide_package_.de.sambalmueslie.openbooking.infrastructure.mail.api.Mail(content.subject, content.content, null))
        notifyContact(mails, info)
    }

    private fun notifyContact(mails: List<de.sambalmueslie.openbooking.infrastructure.mail.api.Mail>, info: BookingRequestInfo) {
        val visitor = info.visitor
        if (visitor.email.isBlank()) return

        val from = _root_ide_package_.de.sambalmueslie.openbooking.infrastructure.mail.api.MailParticipant("", getFromAddress())
        val to = listOf(_root_ide_package_.de.sambalmueslie.openbooking.infrastructure.mail.api.MailParticipant(visitor.name, visitor.email))
        mails.forEach { mailService.send(it, from, to) }
    }

    private fun getFromAddress(): String {
        val settings = settingsService.findByKey(SettingsAPI.SETTINGS_MAIL_FROM_ADDRESS)

        val value = settings?.value as? String
        if (value.isNullOrBlank()) return config.fromAddress

        return value
    }

    private fun getDefaultAdminAddress(): String {
        val settings = settingsService.findByKey(SettingsAPI.SETTINGS_MAIL_DEFAULT_ADMIN_ADDRESS)

        val value = settings?.value as? String
        if (value.isNullOrBlank()) return config.defaultAdminAddress

        return value
    }

}
