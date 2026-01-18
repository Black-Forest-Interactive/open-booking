package de.sambalmueslie.openbooking.gateway.portal.booking

import de.sambalmueslie.openbooking.core.visitor.api.VisitorChangeRequest

data class CreateBookingRequest(
    val visitor: VisitorChangeRequest,
    val offerId: Long,
    val comment: String,
    val termsAndConditions: Boolean
)

