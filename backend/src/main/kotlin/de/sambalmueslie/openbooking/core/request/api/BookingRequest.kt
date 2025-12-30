package de.sambalmueslie.openbooking.core.request.api

import de.sambalmueslie.openbooking.common.BusinessObject

@Deprecated("use reservation instead.", ReplaceWith("reservation"))
data class BookingRequest(
    override val id: Long,
    val key: String,
    val comment: String,
    val status: BookingRequestStatus
) : BusinessObject<Long>
