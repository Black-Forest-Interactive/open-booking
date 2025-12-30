package de.sambalmueslie.openbooking.core.label

import de.sambalmueslie.openbooking.common.GenericCrudService
import de.sambalmueslie.openbooking.common.TimeProvider
import de.sambalmueslie.openbooking.core.cache.CacheService
import de.sambalmueslie.openbooking.core.label.api.Label
import de.sambalmueslie.openbooking.core.label.api.LabelChangeRequest
import de.sambalmueslie.openbooking.core.label.db.LabelData
import de.sambalmueslie.openbooking.core.label.db.LabelRepository
import de.sambalmueslie.openbooking.error.InvalidRequestException
import jakarta.inject.Singleton
import org.slf4j.LoggerFactory

@Singleton
class LabelService(
    private val repository: LabelRepository,

    private val timeProvider: TimeProvider,
    cacheService: CacheService,
) : GenericCrudService<Long, Label, LabelChangeRequest, LabelData>(repository, cacheService, Label::class, logger) {

    companion object {
        private val logger = LoggerFactory.getLogger(LabelService::class.java)
    }

    override fun createData(request: LabelChangeRequest): LabelData {
        return LabelData.create(request, timeProvider.now())
    }

    override fun updateData(data: LabelData, request: LabelChangeRequest): LabelData {
        return data.update(request, timeProvider.now())
    }

    override fun isValid(request: LabelChangeRequest) {
        if (request.color.isEmpty()) throw InvalidRequestException("Color cannot be empty")
    }
}