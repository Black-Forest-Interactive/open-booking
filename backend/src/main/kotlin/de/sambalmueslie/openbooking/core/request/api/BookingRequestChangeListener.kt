package de.sambalmueslie.openbooking.core.request.api

@Deprecated("use reservation instead.", ReplaceWith("reservation"))
interface BookingRequestChangeListener {
    fun confirmed(request: BookingRequest, content: BookingConfirmationContent)
    fun denied(request: BookingRequest, content: BookingConfirmationContent)

}
