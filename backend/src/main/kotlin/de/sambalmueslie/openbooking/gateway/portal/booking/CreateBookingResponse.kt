package de.sambalmueslie.openbooking.gateway.portal.booking

import de.sambalmueslie.openbooking.core.response.api.ResolvedResponse

data class CreateBookingResponse(
    val success: Boolean,
    val response: ResolvedResponse,
)