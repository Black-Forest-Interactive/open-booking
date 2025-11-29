package de.sambalmueslie.openbooking.backend.response.api

import de.sambalmueslie.openbooking.common.BusinessObjectChangeRequest

data class ResponseChangeRequest(
    val lang: String,
    val type: ResponseType,
    val title: String,
    val content: String
) : BusinessObjectChangeRequest
