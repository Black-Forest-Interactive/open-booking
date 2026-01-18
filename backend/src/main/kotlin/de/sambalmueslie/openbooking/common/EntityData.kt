package de.sambalmueslie.openbooking.common

interface EntityData<T : Entity<*>> {
    fun convert(): T
}
