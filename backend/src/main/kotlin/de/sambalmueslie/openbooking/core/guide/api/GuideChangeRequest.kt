package de.sambalmueslie.openbooking.core.guide.api


import de.sambalmueslie.openbooking.common.EntityChangeRequest

data class GuideChangeRequest(
    val firstName: String,
    val lastName: String,
    val email: String,
    val phone: String,
    val mobile: String
) : EntityChangeRequest
