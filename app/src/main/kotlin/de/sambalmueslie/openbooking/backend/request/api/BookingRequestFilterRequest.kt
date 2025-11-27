package de.sambalmueslie.openbooking.backend.request.api

import de.sambalmueslie.openbooking.backend.group.api.VisitorGroupStatus
import java.time.LocalDate

data class BookingRequestFilterRequest(
    val offerDate: LocalDate?,
    val visitorGroupStatus: VisitorGroupStatus?,
    val query: String?
)
