package de.sambalmueslie.openbooking.common

import org.slf4j.Logger


abstract class BaseCrudService<T, O : Entity<T>, R : EntityChangeRequest, L : EntityChangeListener<T, O, R>>(
    private val logger: Logger
) : CrudService<T, O, R, L> {

    private val listeners = mutableSetOf<L>()

    override fun register(listener: L) {
        listeners.add(listener)
    }

    override fun unregister(listener: L) {
        listeners.remove(listener)
    }

    protected fun notifyCreated(obj: O, request: R) {
        notify { it.handleCreated(obj, request) }
    }

    protected fun notifyUpdated(obj: O, request: R) {
        notify { it.handleUpdated(obj, request) }
    }

    protected fun notifyPatched(obj: O) {
        notify { it.handlePatched(obj) }
    }

    protected fun notifyDeleted(obj: O) {
        notify { it.handleDeleted(obj) }
    }

    protected fun notify(action: (L) -> Unit) {
        listeners.forEachWithTryCatch { action.invoke(it) }
    }
}


