package de.sambalmueslie.openbooking.core.visitor


import de.sambalmueslie.openbooking.common.GenericCrudService
import de.sambalmueslie.openbooking.common.TimeProvider
import de.sambalmueslie.openbooking.common.findByIdOrNull
import de.sambalmueslie.openbooking.core.booking.api.Booking
import de.sambalmueslie.openbooking.core.visitor.api.VerificationStatus
import de.sambalmueslie.openbooking.core.visitor.api.Visitor
import de.sambalmueslie.openbooking.core.visitor.api.VisitorChangeRequest
import de.sambalmueslie.openbooking.core.visitor.db.VisitorData
import de.sambalmueslie.openbooking.core.visitor.db.VisitorRepository
import de.sambalmueslie.openbooking.error.InvalidRequestException
import de.sambalmueslie.openbooking.infrastructure.cache.CacheService
import jakarta.inject.Singleton
import org.slf4j.LoggerFactory

@Singleton
class VisitorService(
    private val repository: VisitorRepository,
    private val timeProvider: TimeProvider,
    cacheService: CacheService,
) : GenericCrudService<Long, Visitor, VisitorChangeRequest, VisitorChangeListener, VisitorData>(repository, cacheService, Visitor::class, logger) {

    companion object {
        private val logger = LoggerFactory.getLogger(VisitorService::class.java)
    }

    override fun createData(request: VisitorChangeRequest): VisitorData {
        return VisitorData.create(request, timeProvider.now())
    }

    override fun updateData(data: VisitorData, request: VisitorChangeRequest): VisitorData {
        return data.update(request, timeProvider.now())
    }


    override fun existing(request: VisitorChangeRequest): VisitorData? {
        // TODO check for existing data
        return null
    }


    override fun isValid(request: VisitorChangeRequest) {
        if (request.size <= 0) throw InvalidRequestException("Size must be a positive number")
        if (request.name.isEmpty()) throw InvalidRequestException("Contact cannot be empty")
        if (request.email.isEmpty() && request.phone.isEmpty()) throw InvalidRequestException("Either mail or phone contact must be provided")
    }

    fun get(bookings: List<Booking>): List<Visitor> {
        val visitorIds = bookings.map { it.visitorId }.toSet()
        return getVisitors(visitorIds)
    }

    fun getVisitors(visitorIds: Set<Long>): List<Visitor> {
        return repository.findByIdIn(visitorIds).map { it.convert() }
    }

    fun confirm(id: Long): Visitor? {
        val data = repository.findByIdOrNull(id) ?: return null

        if (data.verificationStatus == VerificationStatus.CONFIRMED) return data.convert()
        if (data.verificationStatus == VerificationStatus.EXPIRED) return null

        data.update(VerificationStatus.CONFIRMED, timeProvider.now())
        val result = repository.update(data).convert()
        super.notifyUpdated(result)
        return result
    }


}
