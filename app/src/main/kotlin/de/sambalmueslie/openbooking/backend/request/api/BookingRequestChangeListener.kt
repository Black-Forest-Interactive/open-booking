package de.sambalmueslie.openbooking.backend.request.api

interface BookingRequestChangeListener {
    fun confirmed(request: BookingRequest, content: BookingConfirmationContent)
    fun denied(request: BookingRequest, content: BookingConfirmationContent)

}
