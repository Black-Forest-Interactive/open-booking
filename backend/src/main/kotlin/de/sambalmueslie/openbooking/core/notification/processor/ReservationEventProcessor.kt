package de.sambalmueslie.openbooking.core.notification.processor

import de.sambalmueslie.openbooking.config.MailConfig
import de.sambalmueslie.openbooking.core.notification.NotificationTemplateEvaluator
import de.sambalmueslie.openbooking.core.notification.api.NotificationEvent
import de.sambalmueslie.openbooking.core.notification.api.NotificationEventType
import de.sambalmueslie.openbooking.core.notification.api.NotificationTemplateType
import de.sambalmueslie.openbooking.core.notification.handler.ReservationChangeHandler
import de.sambalmueslie.openbooking.core.reservation.ReservationService
import de.sambalmueslie.openbooking.core.reservation.api.Reservation
import de.sambalmueslie.openbooking.core.reservation.api.ReservationConfirmationContent
import de.sambalmueslie.openbooking.core.reservation.api.ReservationInfo
import de.sambalmueslie.openbooking.core.reservation.assembler.ReservationInfoAssembler
import de.sambalmueslie.openbooking.core.visitor.api.VerificationStatus
import de.sambalmueslie.openbooking.core.visitor.api.VisitorType
import de.sambalmueslie.openbooking.infrastructure.mail.MailService
import de.sambalmueslie.openbooking.infrastructure.mail.api.Mail
import de.sambalmueslie.openbooking.infrastructure.mail.api.MailParticipant
import de.sambalmueslie.openbooking.infrastructure.settings.SettingService
import de.sambalmueslie.openbooking.infrastructure.settings.api.SettingsAPI
import jakarta.inject.Singleton
import org.slf4j.LoggerFactory
import java.time.format.DateTimeFormatter

@Singleton
class ReservationEventProcessor(
    private val service: ReservationService,
    private val infoAssembler: ReservationInfoAssembler,
    private val evaluator: NotificationTemplateEvaluator,
    private val mailService: MailService,
    private val settingService: SettingService,
    private val config: MailConfig
) : NotificationEventProcessor {
    companion object {
        private val logger = LoggerFactory.getLogger(ReservationEventProcessor::class.java)
        private const val DEFAULT_DATE_FORMAT = "dd-MM-yyyy"
        private const val DEFAULT_TIME_FORMAT = "HH:mm"
    }

    override fun process(event: NotificationEvent) {
        if (event.sourceType != Reservation::class) return
        when (event.type) {
            NotificationEventType.OBJ_CREATED -> handleCreated(event)
            NotificationEventType.CUSTOM -> handleCustom(event)
            else -> return
        }
    }


    private fun handleCustom(event: NotificationEvent) {
        val type = event.parameter[ReservationChangeHandler.TYPE_KEY] ?: return logger.warn("Cannot find ${ReservationChangeHandler.TYPE_KEY} on custom notification event")

        val info = infoAssembler.get(event.sourceId) ?: return
        val content = event.parameter[ReservationChangeHandler.CONTENT] as? ReservationConfirmationContent ?: return
        when (type) {
            ReservationChangeHandler.TYPE_CONFIRMED -> notifyContactOnConfirmed(info, content)
            ReservationChangeHandler.TYPE_DENIED -> notifyContactOnDenied(info, content)
        }
    }


    private fun handleCreated(event: NotificationEvent) {
        val info = infoAssembler.get(event.sourceId) ?: return
        val confirmUrl = if (info.visitor.verification.status == VerificationStatus.CONFIRMED) "" else service.getConfirmationUrl(event.sourceId)
        val detailsUrl = service.getDetailsUrl(event.sourceId)
        val title = if (info.visitor.type == VisitorType.GROUP) info.visitor.title else info.visitor.name
        val age = if (info.visitor.size > 1) "${info.visitor.minAge} - ${info.visitor.maxAge}" else "${info.visitor.minAge}"
        val offer = info.offer.offer
        val dateFormatter = DateTimeFormatter.ofPattern(settingService.getDateFormat().text.ifBlank { DEFAULT_DATE_FORMAT })
        val timeFormatter = DateTimeFormatter.ofPattern(settingService.getTimeFormat().text.ifBlank { DEFAULT_TIME_FORMAT })
        val timestamp = "${offer.start.format(dateFormatter)} ${offer.start.format(timeFormatter)} - ${offer.finish.format(timeFormatter)}"

        val properties = mapOf(
            Pair("info", info),
            Pair("title", title),
            Pair("age", age),
            Pair("timestamp", timestamp),
            Pair("isGroup", info.visitor.type == VisitorType.GROUP),
            Pair("confirmUrl", confirmUrl),
            Pair("detailsUrl", detailsUrl),
        )

        notifyContactOnCreated(properties, info)
        notifyAdminsOnCreated(properties)
    }

    private fun notifyAdminsOnCreated(properties: Map<String, Any>) {
        val mails = evaluator.evaluate(NotificationTemplateType.RESERVATION_CREATED_ADMIN, properties)
        val from = MailParticipant("", getFromAddress())
        val to = listOf(MailParticipant("", getDefaultAdminAddress()))
        mails.forEach { mailService.send(it, from, to) }

    }

    private fun notifyContactOnCreated(properties: Map<String, Any>, info: ReservationInfo) {
        val mails = evaluator.evaluate(NotificationTemplateType.RESERVATION_CREATED_CONTACT, properties)
        notifyContact(mails, info)
    }

    private fun notifyContactOnConfirmed(info: ReservationInfo, content: ReservationConfirmationContent) {
        val mails = listOf(Mail(content.subject, content.content, null))
        notifyContact(mails, info)
    }

    private fun notifyContactOnDenied(info: ReservationInfo, content: ReservationConfirmationContent) {
        val mails = listOf(Mail(content.subject, content.content, null))
        notifyContact(mails, info)
    }

    private fun notifyContact(mails: List<Mail>, info: ReservationInfo) {
        val visitor = info.visitor
        if (visitor.email.isBlank()) return

        val from = MailParticipant("", getFromAddress())
        val to = listOf(MailParticipant(visitor.name, visitor.email))
        mails.forEach { mailService.send(it, from, to) }
    }

    private fun getFromAddress(): String {
        val settings = settingService.findByKey(SettingsAPI.SETTINGS_MAIL_FROM_ADDRESS)

        val value = settings?.value as? String
        if (value.isNullOrBlank()) return config.fromAddress

        return value
    }

    private fun getDefaultAdminAddress(): String {
        val settings = settingService.findByKey(SettingsAPI.SETTINGS_MAIL_DEFAULT_ADMIN_ADDRESS)

        val value = settings?.value as? String
        if (value.isNullOrBlank()) return config.defaultAdminAddress

        return value
    }
}