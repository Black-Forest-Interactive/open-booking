package de.sambalmueslie.openbooking.core.request.api

import de.sambalmueslie.openbooking.common.Entity

@Deprecated("use reservation instead.", ReplaceWith("reservation"))
data class BookingRequest(
    override val id: Long,
    val key: String,
    val comment: String,
    val status: BookingRequestStatus
) : Entity<Long>
