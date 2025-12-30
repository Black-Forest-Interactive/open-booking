package de.sambalmueslie.openbooking.core.request.api

import de.sambalmueslie.openbooking.common.BusinessObjectChangeRequest
import de.sambalmueslie.openbooking.core.visitor.api.VisitorChangeRequest

data class BookingRequestChangeRequest(
    val visitorChangeRequest: VisitorChangeRequest,
    val offerIds: List<Long>,
    val comment: String,
    val autoConfirm: Boolean,
    val ignoreSizeCheck: Boolean
) : BusinessObjectChangeRequest
