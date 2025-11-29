package de.sambalmueslie.openbooking.backend.response.api

import de.sambalmueslie.openbooking.common.BusinessObject

data class Response(
    override val id: Long,
    val lang: String,
    val type: ResponseType,
    val title: String,
    val content: String
) : BusinessObject<Long>
