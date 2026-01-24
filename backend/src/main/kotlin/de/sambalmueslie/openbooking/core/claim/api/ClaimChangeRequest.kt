package de.sambalmueslie.openbooking.core.claim.api

import de.sambalmueslie.openbooking.common.EntityChangeRequest

data class ClaimChangeRequest(
    val offerId: Long,
    val userId: String
) : EntityChangeRequest
