package de.sambalmueslie.openbooking.core.visitor


import de.sambalmueslie.openbooking.common.GenericCrudService
import de.sambalmueslie.openbooking.common.GenericRequestResult
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
        const val MSG_CONFIRM_EMAIL_FAILED = "VISITOR.Message.ConfirmEmailFailed"
        const val MSG_CONFIRM_EMAIL_SUCCEED = "VISITOR.Message.ConfirmEmailSucceed"
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

    fun confirm(id: Long): GenericRequestResult {
        val data = repository.findByIdOrNull(id) ?: return GenericRequestResult(false, MSG_CONFIRM_EMAIL_FAILED)

        if (data.verificationStatus == VerificationStatus.CONFIRMED) return GenericRequestResult(false, MSG_CONFIRM_EMAIL_SUCCEED)
        if (data.verificationStatus == VerificationStatus.EXPIRED) return GenericRequestResult(false, MSG_CONFIRM_EMAIL_FAILED)

        val result = patchData(data) { it.update(VerificationStatus.CONFIRMED, timeProvider.now()) }

        return when (result.verification.status == VerificationStatus.CONFIRMED) {
            true -> GenericRequestResult(true, MSG_CONFIRM_EMAIL_SUCCEED)
            else -> GenericRequestResult(false, MSG_CONFIRM_EMAIL_FAILED)
        }
    }


}
