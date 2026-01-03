package de.sambalmueslie.openbooking.gateway.portal.reservation

import de.sambalmueslie.openbooking.core.visitor.api.VisitorChangeRequest

data class CreateReservationRequest(
    val visitor: VisitorChangeRequest,
    val offerIds: List<Long>,
    val comment: String,
    val termsAndConditions: Boolean
)

