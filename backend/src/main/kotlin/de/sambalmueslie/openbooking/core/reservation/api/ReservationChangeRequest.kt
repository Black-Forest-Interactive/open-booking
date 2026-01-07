package de.sambalmueslie.openbooking.core.reservation.api

import de.sambalmueslie.openbooking.common.BusinessObjectChangeRequest
import de.sambalmueslie.openbooking.core.visitor.api.VisitorChangeRequest

data class ReservationChangeRequest(
    val visitor: VisitorChangeRequest,
    val comment: String,
    val offerId: Long,
    val autoConfirm: Boolean,
    val ignoreSizeCheck: Boolean
) : BusinessObjectChangeRequest
