package de.sambalmueslie.openbooking.core.response.api

enum class ResponseType {
    @Deprecated("use RESERVATION_RECEIVED")
    BOOKING_REQUEST_RECEIVED,

    @Deprecated("use RESERVATION_RECEIVED")
    BOOKING_CONFIRMED,

    @Deprecated("use RESERVATION_RECEIVED")
    BOOKING_DENIED,

    RESERVATION_RECEIVED,
    RESERVATION_FAILED,

    RESERVATION_CONFIRMED,
    RESERVATION_DENIED,

}
