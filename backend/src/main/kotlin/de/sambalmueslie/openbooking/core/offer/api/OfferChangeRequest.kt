package de.sambalmueslie.openbooking.core.offer.api

import de.sambalmueslie.openbooking.common.BusinessObjectChangeRequest
import java.time.LocalDateTime

data class OfferChangeRequest(
    val start: LocalDateTime,
    val finish: LocalDateTime,
    val maxPersons: Int,
    val active: Boolean
) : BusinessObjectChangeRequest
