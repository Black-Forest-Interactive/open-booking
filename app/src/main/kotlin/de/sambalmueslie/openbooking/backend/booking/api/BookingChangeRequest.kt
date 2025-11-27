package de.sambalmueslie.openbooking.backend.booking.api

import de.sambalmueslie.openbooking.common.BusinessObjectChangeRequest

data class BookingChangeRequest(
    var offerId: Long,
    var visitorGroupId: Long,
) : BusinessObjectChangeRequest
