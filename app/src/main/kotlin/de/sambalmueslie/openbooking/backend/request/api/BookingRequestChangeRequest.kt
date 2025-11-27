package de.sambalmueslie.openbooking.backend.request.api

import de.sambalmueslie.openbooking.backend.group.api.VisitorGroupChangeRequest
import de.sambalmueslie.openbooking.common.BusinessObjectChangeRequest

data class BookingRequestChangeRequest(
    val visitorGroupChangeRequest: VisitorGroupChangeRequest,
    val offerIds: List<Long>,
    val comment: String,
    val autoConfirm: Boolean,
    val ignoreSizeCheck: Boolean
) : BusinessObjectChangeRequest
