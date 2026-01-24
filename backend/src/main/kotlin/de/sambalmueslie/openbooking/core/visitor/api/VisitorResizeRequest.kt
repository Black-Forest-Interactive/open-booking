package de.sambalmueslie.openbooking.core.visitor.api

data class VisitorResizeRequest(
    val size: Int,
    val minAge: Int,
    val maxAge: Int,
)
