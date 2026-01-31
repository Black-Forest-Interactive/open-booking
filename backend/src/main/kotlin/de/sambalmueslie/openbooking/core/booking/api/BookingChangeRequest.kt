package de.sambalmueslie.openbooking.core.booking.api

import de.sambalmueslie.openbooking.common.EntityChangeRequest
import de.sambalmueslie.openbooking.core.visitor.api.VisitorChangeRequest

data class BookingChangeRequest(
    val visitor: VisitorChangeRequest,
    val comment: String,
    val lang: String,
    val offerId: Long,
    val autoConfirm: Boolean,
    val ignoreSizeCheck: Boolean,
    val noCreateNotification: Boolean
) : EntityChangeRequest
