package de.sambalmueslie.openbooking.core.group


import de.sambalmueslie.openbooking.core.booking.api.Booking
import de.sambalmueslie.openbooking.core.cache.CacheService
import de.sambalmueslie.openbooking.core.group.api.VisitorGroup
import de.sambalmueslie.openbooking.core.group.api.VisitorGroupChangeRequest
import de.sambalmueslie.openbooking.core.group.api.VisitorGroupStatus
import de.sambalmueslie.openbooking.core.group.db.VisitorGroupData
import de.sambalmueslie.openbooking.core.group.db.VisitorGroupRepository
import de.sambalmueslie.openbooking.common.GenericCrudService
import de.sambalmueslie.openbooking.common.TimeProvider
import de.sambalmueslie.openbooking.common.findByIdOrNull
import de.sambalmueslie.openbooking.error.InvalidRequestException
import jakarta.inject.Singleton
import org.slf4j.Logger
import org.slf4j.LoggerFactory

@Singleton
class VisitorGroupService(
    private val repository: VisitorGroupRepository,
    private val timeProvider: TimeProvider,
    cacheService: CacheService,
) : GenericCrudService<Long, VisitorGroup, VisitorGroupChangeRequest, VisitorGroupData>(repository, cacheService, VisitorGroup::class, logger) {

    companion object {
        private val logger: Logger = LoggerFactory.getLogger(VisitorGroupService::class.java)
    }

    override fun createData(request: VisitorGroupChangeRequest): VisitorGroupData {
        return VisitorGroupData.create(request, timeProvider.now())
    }

    override fun updateData(data: VisitorGroupData, request: VisitorGroupChangeRequest): VisitorGroupData {
        return data.update(request, timeProvider.now())
    }


    override fun existing(request: VisitorGroupChangeRequest): VisitorGroupData? {
        // TODO check for existing data
        return null
    }


    override fun isValid(request: VisitorGroupChangeRequest) {
        if (request.title.isEmpty()) throw InvalidRequestException("Title cannot be empty")
        if (request.size <= 0) throw InvalidRequestException("Size must be a positive number")
        if (request.minAge < 0) throw InvalidRequestException("Min Age must be >= 0")
        if (request.maxAge <= 0) throw InvalidRequestException("Max Age must be a positive number")
        if (request.contact.isEmpty()) throw InvalidRequestException("Contact cannot be empty")
        if (request.email.isEmpty() && request.phone.isEmpty()) throw InvalidRequestException("Either mail or phone contact must be provided")
    }

    fun get(bookings: List<Booking>): List<VisitorGroup> {
        val visitorGroupIds = bookings.map { it.visitorGroupId }.toSet()
        return getVisitorGroups(visitorGroupIds)
    }

    fun getVisitorGroups(visitorGroupIds: Set<Long>): List<VisitorGroup> {
        return repository.findByIdIn(visitorGroupIds).map { it.convert() }
    }

    fun confirm(id: Long): VisitorGroup? {
        val data = repository.findByIdOrNull(id) ?: return null

        if (data.status == VisitorGroupStatus.CONFIRMED) return data.convert()

        data.update(VisitorGroupStatus.CONFIRMED, timeProvider.now())
        val result = repository.update(data).convert()
        super.notifyUpdated(result)
        return result
    }


}
