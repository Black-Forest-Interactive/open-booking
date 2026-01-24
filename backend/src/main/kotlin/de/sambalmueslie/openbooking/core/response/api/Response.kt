package de.sambalmueslie.openbooking.core.response.api

import de.sambalmueslie.openbooking.common.Entity
import java.time.LocalDateTime

data class Response(
    override val id: Long,
    val lang: String,
    val type: ResponseType,
    val title: String,
    val content: String,
    override val created: LocalDateTime,
    override val updated: LocalDateTime?,
) : Entity<Long>
