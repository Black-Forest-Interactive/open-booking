package de.sambalmueslie.openbooking.backend.notification


import de.sambalmueslie.openbooking.backend.cache.CacheService
import de.sambalmueslie.openbooking.backend.notification.api.NotificationTemplate
import de.sambalmueslie.openbooking.backend.notification.api.NotificationTemplateChangeRequest
import de.sambalmueslie.openbooking.backend.notification.api.NotificationTemplateType
import de.sambalmueslie.openbooking.backend.notification.db.NotificationTemplateData
import de.sambalmueslie.openbooking.backend.notification.db.NotificationTemplateRepository
import de.sambalmueslie.openbooking.common.GenericCrudService
import de.sambalmueslie.openbooking.common.TimeProvider
import de.sambalmueslie.openbooking.error.InvalidRequestException
import jakarta.inject.Singleton
import org.slf4j.Logger
import org.slf4j.LoggerFactory

@Singleton
class NotificationTemplateService(
    private val repository: NotificationTemplateRepository,
    private val timeProvider: TimeProvider,
    cacheService: CacheService,
) : GenericCrudService<Long, NotificationTemplate, NotificationTemplateChangeRequest, NotificationTemplateData>(repository, cacheService, NotificationTemplate::class, logger) {

    companion object {
        private val logger: Logger = LoggerFactory.getLogger(NotificationTemplateService::class.java)
    }

    override fun createData(request: NotificationTemplateChangeRequest): NotificationTemplateData {
        return NotificationTemplateData.create(request, timeProvider.now())
    }

    override fun updateData(data: NotificationTemplateData, request: NotificationTemplateChangeRequest): NotificationTemplateData {
        return data.update(request, timeProvider.now())
    }

    override fun isValid(request: NotificationTemplateChangeRequest) {
        if (request.lang.isBlank()) throw InvalidRequestException("Language is not allowed to be blank")
        if (request.subject.isBlank()) throw InvalidRequestException("Subject is not allowed to be blank")
        if (request.content.isBlank()) throw InvalidRequestException("Content is not allowed to be blank")
    }

    fun findByType(type: NotificationTemplateType, lang: String): List<NotificationTemplate> {
        return repository.findByTypeAndLang(type, lang).map { it.convert() }
    }

}
