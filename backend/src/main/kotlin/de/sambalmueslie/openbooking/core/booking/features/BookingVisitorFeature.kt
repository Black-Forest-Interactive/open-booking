package de.sambalmueslie.openbooking.core.booking.features

import de.sambalmueslie.openbooking.common.TimeProvider
import de.sambalmueslie.openbooking.core.booking.api.BookingChangeRequest
import de.sambalmueslie.openbooking.core.booking.api.BookingResizeRequest
import de.sambalmueslie.openbooking.core.booking.db.BookingData
import de.sambalmueslie.openbooking.core.visitor.VisitorService
import de.sambalmueslie.openbooking.core.visitor.api.VerificationStatus
import de.sambalmueslie.openbooking.core.visitor.api.Visitor
import jakarta.inject.Singleton
import org.slf4j.LoggerFactory

@Singleton
class BookingVisitorFeature(
    private val visitorService: VisitorService,
    private val timeProvider: TimeProvider
) {
    companion object {
        private val logger = LoggerFactory.getLogger(BookingVisitorFeature::class.java)
    }

    fun create(request: BookingChangeRequest): Visitor {
        val visitor = visitorService.create(request.visitor)
        if (request.autoConfirm) {
            visitorService.confirm(visitor.id)
        }
        return visitor
    }

    fun update(data: BookingData, request: BookingChangeRequest): Visitor {
        val visitor = visitorService.update(data.visitorId, request.visitor)
        return update(data, visitor, request.autoConfirm)
    }

    fun update(data: BookingData, request: BookingResizeRequest): Visitor? {
        val visitor = visitorService.updateSize(data.visitorId, request.visitor) ?: return null
        return update(data, visitor, request.autoConfirm)
    }

    private fun update(data: BookingData, visitor: Visitor, autoConfirm: Boolean): Visitor {
        val isConfirmed = visitor.verification.status == VerificationStatus.CONFIRMED
        if (autoConfirm && !isConfirmed) {
            visitorService.confirm(visitor.id)
        }

        data.update(visitor, timeProvider.now())
        return visitor
    }
}