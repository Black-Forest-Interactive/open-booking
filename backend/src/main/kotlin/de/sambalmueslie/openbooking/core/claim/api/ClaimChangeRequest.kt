package de.sambalmueslie.openbooking.core.claim.api

import de.sambalmueslie.openbooking.common.BusinessObjectChangeRequest

data class ClaimChangeRequest(
    val offerId: Long, val userId: String
) : BusinessObjectChangeRequest
