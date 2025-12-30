package de.sambalmueslie.openbooking.core.search.common

data class SearchUpdateEvent<T>(
    val data: T,
    val type: ChangeType
)
