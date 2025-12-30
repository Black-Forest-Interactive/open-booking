package de.sambalmueslie.openbooking.frontend.user.api

import de.sambalmueslie.openbooking.core.visitor.api.VisitorChangeRequest

data class CreateBookingRequest(
    val visitorChangeRequest: VisitorChangeRequest,
    val offerIds: List<Long>,
    val comment: String,
    val termsAndConditions: Boolean
)
