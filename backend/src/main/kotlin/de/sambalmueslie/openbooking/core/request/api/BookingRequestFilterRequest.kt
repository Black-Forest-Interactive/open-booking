package de.sambalmueslie.openbooking.core.request.api

import de.sambalmueslie.openbooking.core.visitor.api.VerificationStatus
import java.time.LocalDate

data class BookingRequestFilterRequest(
    val offerDate: LocalDate?,
    val visitorGroupStatus: VerificationStatus?,
    val query: String?
)
