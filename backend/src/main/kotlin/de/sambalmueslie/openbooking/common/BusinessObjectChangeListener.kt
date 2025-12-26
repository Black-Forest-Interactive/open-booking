package de.sambalmueslie.openbooking.common

interface BusinessObjectChangeListener<T, O : BusinessObject<T>> {
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
