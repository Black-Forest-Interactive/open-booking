package de.sambalmueslie.openbooking.core.guide


import de.sambalmueslie.openbooking.common.GenericCrudService
import de.sambalmueslie.openbooking.common.TimeProvider
import de.sambalmueslie.openbooking.core.guide.api.Guide
import de.sambalmueslie.openbooking.core.guide.api.GuideChangeRequest
import de.sambalmueslie.openbooking.core.guide.db.GuideData
import de.sambalmueslie.openbooking.core.guide.db.GuideRepository
import de.sambalmueslie.openbooking.error.InvalidRequestException
import de.sambalmueslie.openbooking.infrastructure.cache.CacheService
import jakarta.inject.Singleton
import org.slf4j.LoggerFactory

@Singleton
class GuideService(
    private val repository: GuideRepository,
    private val timeProvider: TimeProvider,
    cacheService: CacheService,
) : GenericCrudService<Long, Guide, GuideChangeRequest, GuideChangeListener, GuideData>(repository, cacheService, Guide::class, logger) {


    companion object {
        private val logger = LoggerFactory.getLogger(GuideService::class.java)
    }

    override fun createData(request: GuideChangeRequest): GuideData {
        return GuideData.create(request, timeProvider.now())
    }

    override fun updateData(data: GuideData, request: GuideChangeRequest): GuideData {
        return data.update(request, timeProvider.now())
    }

    override fun isValid(request: GuideChangeRequest) {
        if (request.firstName.isEmpty()) throw InvalidRequestException("First name cannot be empty")
        if (request.lastName.isEmpty()) throw InvalidRequestException("Last name cannot be empty")
    }

    fun getByIds(ids: Set<Long>): List<Guide> {
        return repository.findByIdIn(ids).map { it.convert() }
    }


}
