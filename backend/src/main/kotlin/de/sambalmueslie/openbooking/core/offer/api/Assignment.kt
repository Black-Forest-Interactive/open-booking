package de.sambalmueslie.openbooking.core.offer.api

data class Assignment(
    val confirmedSpace: Int,
    val pendingSpace: Int,
    val availableSpace: Int,
    val deactivatedSpace: Int,
)
