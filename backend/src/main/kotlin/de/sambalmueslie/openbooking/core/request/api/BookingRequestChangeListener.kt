package de.sambalmueslie.openbooking.core.request.api

interface BookingRequestChangeListener {
    fun confirmed(request: BookingRequest, content: BookingConfirmationContent)
    fun denied(request: BookingRequest, content: BookingConfirmationContent)

}
