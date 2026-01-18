package de.sambalmueslie.openbooking.core.response.api

enum class ResponseType {

    BOOKING_CONFIRM,
    BOOKING_DECLINE,

    BOOKING_FAILED,
    BOOKING_RECEIVED,

    @Deprecated("use RESERVATION_RECEIVED")
    BOOKING_REQUEST_RECEIVED,

    @Deprecated("use RESERVATION_RECEIVED")
    BOOKING_CONFIRMED,

    @Deprecated("use RESERVATION_RECEIVED")
    BOOKING_DENIED,

    @Deprecated("use RESERVATION_RECEIVED")
    RESERVATION_RECEIVED,

    @Deprecated("use RESERVATION_RECEIVED")
    RESERVATION_FAILED,

    @Deprecated("use RESERVATION_RECEIVED")
    RESERVATION_CONFIRMED,

    @Deprecated("use RESERVATION_RECEIVED")
    RESERVATION_DENIED,

}
