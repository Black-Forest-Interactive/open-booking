package de.sambalmueslie.openbooking.core.request.api

import de.sambalmueslie.openbooking.core.visitor.api.VerificationStatus
import java.time.LocalDate

@Deprecated("use reservation instead.", ReplaceWith("reservation"))
data class BookingRequestFilterRequest(
    val offerDate: LocalDate?,
    val visitorStatus: VerificationStatus?,
    val query: String?
)
