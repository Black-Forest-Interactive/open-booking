package de.sambalmueslie.openbooking.core.offer.api

import de.sambalmueslie.openbooking.common.EntityChangeRequest
import java.time.LocalDateTime

data class OfferChangeRequest(
    val start: LocalDateTime,
    val finish: LocalDateTime,
    val maxPersons: Int,
    val active: Boolean,
    val labelId: Long?,
    val guideId: Long?
) : EntityChangeRequest
