package de.sambalmueslie.openbooking.core.request

import de.sambalmueslie.openbooking.common.EntityChangeListener
import de.sambalmueslie.openbooking.core.request.api.BookingConfirmationContent
import de.sambalmueslie.openbooking.core.request.api.BookingRequest

interface BookingRequestChangeListener : EntityChangeListener<Long, BookingRequest> {
    fun confirmed(request: BookingRequest, content: BookingConfirmationContent)
    fun denied(request: BookingRequest, content: BookingConfirmationContent)
}