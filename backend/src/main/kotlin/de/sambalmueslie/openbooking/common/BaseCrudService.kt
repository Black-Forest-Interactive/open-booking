package de.sambalmueslie.openbooking.common

import org.slf4j.Logger


abstract class BaseCrudService<T, O : Entity<T>, R : EntityChangeRequest, L : EntityChangeListener<T, O>>(
    private val logger: Logger
) : CrudService<T, O, R, L> {

    private val listeners = mutableSetOf<L>()

    override fun register(listener: L) {
        listeners.add(listener)
    }

    override fun unregister(listener: L) {
        listeners.remove(listener)
    }

    protected fun notifyCreated(obj: O) {
        notify { it.handleCreated(obj) }
    }

    protected fun notifyUpdated(obj: O) {
        notify { it.handleUpdated(obj) }
    }

    protected fun notifyDeleted(obj: O) {
        notify { it.handleDeleted(obj) }
    }

    protected fun notify(action: (L) -> Unit) {
        listeners.forEachWithTryCatch { action.invoke(it) }
    }
}


