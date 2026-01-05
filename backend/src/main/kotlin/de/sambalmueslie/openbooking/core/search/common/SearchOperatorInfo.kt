package de.sambalmueslie.openbooking.core.search.common

data class SearchOperatorInfo(
    val key: String,
    val name: String,
    val status: SearchOperatorStatus,
    val statistics: SearchOperatorStats
)
