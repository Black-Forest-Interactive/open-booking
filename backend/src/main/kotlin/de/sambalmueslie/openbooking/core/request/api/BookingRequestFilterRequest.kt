package de.sambalmueslie.openbooking.core.request.api

import de.sambalmueslie.openbooking.core.group.api.VisitorGroupStatus
import java.time.LocalDate

data class BookingRequestFilterRequest(
    val offerDate: LocalDate?,
    val visitorGroupStatus: VisitorGroupStatus?,
    val query: String?
)
