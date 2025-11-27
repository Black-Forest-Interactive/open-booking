package de.sambalmueslie.openbooking.backend.notification


import de.sambalmueslie.openbooking.backend.export.tools.LocalDateTimeTool
import de.sambalmueslie.openbooking.backend.notification.api.ContentType
import de.sambalmueslie.openbooking.backend.notification.api.NotificationTemplate
import de.sambalmueslie.openbooking.backend.notification.api.NotificationTemplateType
import de.sambalmueslie.openbooking.backend.mail.api.Mail
import jakarta.inject.Singleton
import org.apache.velocity.app.VelocityEngine
import org.apache.velocity.tools.ToolManager
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import java.io.StringWriter

@Singleton
class NotificationTemplateEvaluator(
    private val templateService: NotificationTemplateService
) {


    companion object {
        private val logger: Logger = LoggerFactory.getLogger(NotificationTemplateEvaluator::class.java)
    }

    private val ve = VelocityEngine()

    init {
        ve.init()
    }


    fun evaluate(type: NotificationTemplateType, properties: Map<String, Any>, lang: String = "de"): List<Mail> {
        val templates = templateService.findByType(type, lang)
        return templates.groupBy { it.type }.mapNotNull { evaluate(it.value, properties) }
    }

    private fun evaluate(templates: List<NotificationTemplate>, properties: Map<String, Any>): Mail? {
        val plain = evaluate(templates, properties, ContentType.PLAIN)
        val html = evaluate(templates, properties, ContentType.HTML)

        val subject = plain?.first ?: html?.first ?: return null
        return Mail(subject, html?.second, plain?.second)
    }

    private fun evaluate(templates: List<NotificationTemplate>, properties: Map<String, Any>, type: ContentType): Pair<String, String>? {
        val template = templates.find { it.contentType == type } ?: return null
        return evaluate(template, properties)
    }

    private fun evaluate(template: NotificationTemplate, properties: Map<String, Any>): Pair<String, String> {
        val manager = ToolManager()
        val context = manager.createContext()
        context.putVelocityEngine(ve)
        context.putAll(properties)
        context.put("dateTool", LocalDateTimeTool())

        val subjectWriter = StringWriter()
        ve.evaluate(context, subjectWriter, "Notification Template Evaluator", template.subject)
        val contentWriter = StringWriter()
        ve.evaluate(context, contentWriter, "Notification Template Evaluator", template.content)

        return Pair(subjectWriter.toString(), contentWriter.toString())
    }
}
