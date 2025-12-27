package de.sambalmueslie.openbooking.core.role


import de.sambalmueslie.openbooking.common.GenericCrudService
import de.sambalmueslie.openbooking.common.TimeProvider
import de.sambalmueslie.openbooking.core.cache.CacheService
import de.sambalmueslie.openbooking.core.role.api.TourRole
import de.sambalmueslie.openbooking.core.role.api.TourRoleChangeRequest
import de.sambalmueslie.openbooking.core.role.db.TourRoleData
import de.sambalmueslie.openbooking.core.role.db.TourRoleRepository
import de.sambalmueslie.openbooking.error.InvalidRequestException
import jakarta.inject.Singleton
import org.slf4j.LoggerFactory

@Singleton
class RoleService(
    private val repository: TourRoleRepository,
    private val timeProvider: TimeProvider,
    cacheService: CacheService,
) : GenericCrudService<Long, TourRole, TourRoleChangeRequest, TourRoleData>(repository, cacheService, TourRole::class, logger) {
    companion object {
        private val logger = LoggerFactory.getLogger(RoleService::class.java)
    }

    override fun createData(request: TourRoleChangeRequest): TourRoleData {
        return TourRoleData.create(request, timeProvider.now())
    }

    override fun updateData(data: TourRoleData, request: TourRoleChangeRequest): TourRoleData {
        return data.update(request, timeProvider.now())
    }

    override fun isValid(request: TourRoleChangeRequest) {
        if (request.name.isEmpty()) throw InvalidRequestException("Name cannot be empty")
    }


}
