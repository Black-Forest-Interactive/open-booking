package de.sambalmueslie.openbooking.core.offer.api

data class Assignment(
    val bookedSpace: Int,
    val reservedSpace: Int,
    val availableSpace: Int,
)
