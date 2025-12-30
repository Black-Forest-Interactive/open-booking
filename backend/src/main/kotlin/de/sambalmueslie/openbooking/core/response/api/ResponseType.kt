package de.sambalmueslie.openbooking.core.response.api

enum class ResponseType {
    @Deprecated("use RESERVATION_RECEIVED")
    BOOKING_REQUEST_RECEIVED,

    @Deprecated("use RESERVATION_FAILED")
    BOOKING_REQUEST_FAILED,
    
    BOOKING_CONFIRMED,
    BOOKING_DENIED,

    RESERVATION_RECEIVED,
    RESERVATION_FAILED,

}
