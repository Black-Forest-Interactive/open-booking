package de.sambalmueslie.openbooking.backend.staff


import de.sambalmueslie.openbooking.backend.cache.CacheService
import de.sambalmueslie.openbooking.backend.staff.api.StaffMember
import de.sambalmueslie.openbooking.backend.staff.api.StaffMemberChangeRequest
import de.sambalmueslie.openbooking.backend.staff.db.StaffMemberData
import de.sambalmueslie.openbooking.backend.staff.db.StaffMemberRepository
import de.sambalmueslie.openbooking.common.GenericCrudService
import de.sambalmueslie.openbooking.common.TimeProvider
import de.sambalmueslie.openbooking.error.InvalidRequestException
import jakarta.inject.Singleton
import org.slf4j.Logger
import org.slf4j.LoggerFactory

@Singleton
class StaffService(
    private val repository: StaffMemberRepository,
    private val timeProvider: TimeProvider,
    cacheService: CacheService,
) : GenericCrudService<Long, StaffMember, StaffMemberChangeRequest, StaffMemberData>(repository, cacheService, StaffMember::class, logger) {


    companion object {
        private val logger: Logger = LoggerFactory.getLogger(StaffService::class.java)
    }

    override fun createData(request: StaffMemberChangeRequest): StaffMemberData {
        return StaffMemberData.create(request, timeProvider.now())
    }

    override fun updateData(data: StaffMemberData, request: StaffMemberChangeRequest): StaffMemberData {
        return data.update(request, timeProvider.now())
    }

    override fun isValid(request: StaffMemberChangeRequest) {
        if (request.firstName.isEmpty()) throw InvalidRequestException("First name cannot be empty")
        if (request.lastName.isEmpty()) throw InvalidRequestException("First name cannot be empty")
        if (request.email.isEmpty() && request.phone.isEmpty() && request.mobile.isEmpty())
            throw InvalidRequestException("Either mail or phone or mobile contact must be provided")
    }


}
