package de.sambalmueslie.openbooking.core.request.api

import de.sambalmueslie.openbooking.common.BusinessObjectChangeRequest
import de.sambalmueslie.openbooking.core.group.api.VisitorGroupChangeRequest

data class BookingRequestChangeRequest(
    val visitorGroupChangeRequest: VisitorGroupChangeRequest,
    val offerIds: List<Long>,
    val comment: String,
    val autoConfirm: Boolean,
    val ignoreSizeCheck: Boolean
) : BusinessObjectChangeRequest
