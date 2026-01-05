package de.sambalmueslie.openbooking.core.search.common

interface SearchUpdateListener<T> {
    fun updateSearch(event: SearchUpdateEvent<T>)
}