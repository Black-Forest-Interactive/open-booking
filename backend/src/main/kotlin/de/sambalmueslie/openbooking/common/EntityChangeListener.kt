package de.sambalmueslie.openbooking.common

interface EntityChangeListener<T, O : Entity<T>> {
    fun handleCreated(obj: O) {
        // intentionally left empty
    }

    fun handleUpdated(obj: O) {
        // intentionally left empty
    }

    fun handleDeleted(obj: O) {
        // intentionally left empty
    }
}
