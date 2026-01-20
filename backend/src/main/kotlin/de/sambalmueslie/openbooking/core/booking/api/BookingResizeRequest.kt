package de.sambalmueslie.openbooking.core.booking.api

import de.sambalmueslie.openbooking.core.visitor.api.VisitorResizeRequest

data class BookingResizeRequest(
    val visitor: VisitorResizeRequest,
    val autoConfirm: Boolean,
    val ignoreSizeCheck: Boolean
)
