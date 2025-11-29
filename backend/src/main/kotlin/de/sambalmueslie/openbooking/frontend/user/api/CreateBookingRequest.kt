package de.sambalmueslie.openbooking.frontend.user.api

import de.sambalmueslie.openbooking.backend.group.api.VisitorGroupChangeRequest

data class CreateBookingRequest(
    val visitorGroupChangeRequest: VisitorGroupChangeRequest,
    val offerIds: List<Long>,
    val comment: String,
    val termsAndConditions: Boolean
)
