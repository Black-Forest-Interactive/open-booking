package de.sambalmueslie.openbooking.core.response.api

import de.sambalmueslie.openbooking.common.EntityChangeRequest

data class ResponseChangeRequest(
    val lang: String,
    val type: ResponseType,
    val title: String,
    val content: String
) : EntityChangeRequest
