package de.sambalmueslie.openbooking.core.notification.processor


import de.sambalmueslie.openbooking.config.MailConfig
import de.sambalmueslie.openbooking.core.mail.MailService
import de.sambalmueslie.openbooking.core.mail.api.Mail
import de.sambalmueslie.openbooking.core.mail.api.MailParticipant
import de.sambalmueslie.openbooking.core.notification.NotificationTemplateEvaluator
import de.sambalmueslie.openbooking.core.notification.api.NotificationEvent
import de.sambalmueslie.openbooking.core.notification.api.NotificationEventType
import de.sambalmueslie.openbooking.core.notification.api.NotificationTemplateType
import de.sambalmueslie.openbooking.core.notification.handler.BookingRequestChangeHandler
import de.sambalmueslie.openbooking.core.request.BookingRequestService
import de.sambalmueslie.openbooking.core.request.api.BookingConfirmationContent
import de.sambalmueslie.openbooking.core.request.api.BookingRequest
import de.sambalmueslie.openbooking.core.request.api.BookingRequestInfo
import de.sambalmueslie.openbooking.core.settings.SettingsService
import de.sambalmueslie.openbooking.core.settings.api.SettingsAPI
import de.sambalmueslie.openbooking.core.visitor.api.VerificationStatus
import jakarta.inject.Singleton
import org.slf4j.LoggerFactory

@Singleton
class BookingRequestEventProcessor(
    private val service: BookingRequestService,
    private val evaluator: NotificationTemplateEvaluator,
    private val mailService: MailService,
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
        val url = if (info.visitor.status == VerificationStatus.CONFIRMED) "" else service.getConfirmationUrl(event.sourceId)

        val properties = mapOf(
            Pair("info", info),
            Pair("url", url)
        )

        notifyContactOnCreated(properties, info)
        notifyAdminsOnCreated(properties)
    }

    private fun notifyAdminsOnCreated(properties: Map<String, Any>) {
        val mails = evaluator.evaluate(NotificationTemplateType.BOOKING_REQUEST_CREATED_ADMIN, properties)
        val from = MailParticipant("", getFromAddress())
        val to = listOf(MailParticipant("", getDefaultAdminAddress()))
        mails.forEach { mailService.send(it, from, to) }

    }

    private fun notifyContactOnCreated(properties: Map<String, Any>, info: BookingRequestInfo) {
        val mails = evaluator.evaluate(NotificationTemplateType.BOOKING_REQUEST_CREATED_CONTACT, properties)
        notifyContact(mails, info)
    }

    private fun notifyContactOnConfirmed(info: BookingRequestInfo, content: BookingConfirmationContent) {
        val mails = listOf(Mail(content.subject, content.content, null))
        notifyContact(mails, info)
    }

    private fun notifyContactOnDenied(info: BookingRequestInfo, content: BookingConfirmationContent) {
        val mails = listOf(Mail(content.subject, content.content, null))
        notifyContact(mails, info)
    }

    private fun notifyContact(mails: List<Mail>, info: BookingRequestInfo) {
        val visitorGroup = info.visitor
        if (visitorGroup.email.isBlank()) return

        val from = MailParticipant("", getFromAddress())
        val to = listOf(MailParticipant(visitorGroup.contact, visitorGroup.email))
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
