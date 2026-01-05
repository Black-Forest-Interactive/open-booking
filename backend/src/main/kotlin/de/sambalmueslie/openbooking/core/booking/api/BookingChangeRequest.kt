package de.sambalmueslie.openbooking.core.booking.api

import de.sambalmueslie.openbooking.common.BusinessObjectChangeRequest

data class BookingChangeRequest(
    val offerId: Long,
    val visitorId: Long,
    val comment: String
) : BusinessObjectChangeRequest
