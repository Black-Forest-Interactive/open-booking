package de.sambalmueslie.openbooking.core.response.api

import de.sambalmueslie.openbooking.common.Entity

data class Response(
    override val id: Long,
    val lang: String,
    val type: ResponseType,
    val title: String,
    val content: String
) : Entity<Long>
