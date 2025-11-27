package de.sambalmueslie.openbooking.backend.group.api

import de.sambalmueslie.openbooking.common.BusinessObjectChangeRequest

data class VisitorGroupChangeRequest(
    val title: String,
    val size: Int,
    val isGroup: Boolean,
    val minAge: Int,
    val maxAge: Int,
    val contact: String,
    val address: Address,
    val phone: String,
    val email: String,
) : BusinessObjectChangeRequest
