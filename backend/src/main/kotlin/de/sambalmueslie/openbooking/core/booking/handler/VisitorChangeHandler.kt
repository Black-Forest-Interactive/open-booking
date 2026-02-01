package de.sambalmueslie.openbooking.core.booking.handler

import de.sambalmueslie.openbooking.core.booking.BookingService
import de.sambalmueslie.openbooking.core.visitor.VisitorChangeListener
import de.sambalmueslie.openbooking.core.visitor.VisitorService
import de.sambalmueslie.openbooking.core.visitor.api.Visitor
import de.sambalmueslie.openbooking.core.visitor.api.VisitorChangeRequest
import jakarta.inject.Singleton
import org.slf4j.LoggerFactory

@Singleton
class VisitorChangeHandler(
    private val service: BookingService,
    visitorService: VisitorService,
) : VisitorChangeListener {
    companion object {
        private val logger = LoggerFactory.getLogger(VisitorChangeHandler::class.java)
    }

    init {
        visitorService.register(this)
    }

    override fun handleCreated(obj: Visitor, request: VisitorChangeRequest) {
        // TODO verify size if visitor is assigned to a booking
//        handleVisitorChanged(obj)
    }

    override fun handleUpdated(obj: Visitor, request: VisitorChangeRequest) {
        // TODO verify size if visitor is assigned to a booking
//        handleVisitorChanged(obj)
    }

    override fun handleDeleted(obj: Visitor) {
        // TODO  delete bookings and send out decline messages
//        val sequence = PageableSequence { repository.findByVisitorId(obj.id, it) }
//        sequence.forEach { delete(it) }
    }


}