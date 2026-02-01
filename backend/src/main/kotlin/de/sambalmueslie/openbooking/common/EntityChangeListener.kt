package de.sambalmueslie.openbooking.common

interface EntityChangeListener<T, O : Entity<T>, R : EntityChangeRequest> {
    fun handleCreated(obj: O, request: R) {
        // intentionally left empty
    }

    fun handleUpdated(obj: O, request: R) {
        // intentionally left empty
    }


    fun handlePatched(obj: O) {
        // intentionally left empty
    }

    fun handleDeleted(obj: O) {
        // intentionally left empty
    }
}
