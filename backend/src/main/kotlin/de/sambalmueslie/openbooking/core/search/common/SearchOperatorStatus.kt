package de.sambalmueslie.openbooking.core.search.common

enum class SearchOperatorStatus {
    IDLE,
    UNKNOWN,
    CREATE_INDEX,
    INITIAL_LOAD,
    READY
}