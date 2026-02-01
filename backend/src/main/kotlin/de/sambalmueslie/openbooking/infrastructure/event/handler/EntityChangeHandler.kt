package de.sambalmueslie.openbooking.infrastructure.event.handler

import de.sambalmueslie.openbooking.common.Entity
import de.sambalmueslie.openbooking.common.EntityChangeListener
import de.sambalmueslie.openbooking.common.EntityChangeRequest
import de.sambalmueslie.openbooking.infrastructure.event.EventService
import de.sambalmueslie.openbooking.infrastructure.event.api.ChangeEventType
import kotlin.reflect.KClass

abstract class EntityChangeHandler<T, O : Entity<T>, R : EntityChangeRequest>(
    private val type: KClass<O>,
    private val queue: EventService
) : EntityChangeListener<T, O, R> {


    final override fun handleCreated(obj: O, request: R) {
        publishEvent(ChangeEventType.CREATE, obj)
    }

    final override fun handleUpdated(obj: O, request: R) {
        publishEvent(ChangeEventType.UPDATE, obj)
    }

    final override fun handlePatched(obj: O) {
        publishEvent(ChangeEventType.UPDATE, obj)
    }

    final override fun handleDeleted(obj: O) {
        publishEvent(ChangeEventType.DELETE, obj)
    }

    protected fun publishEvent(changeType: ChangeEventType, obj: O) {
        queue.publishEvent(changeType, obj.id.toString(), type.simpleName ?: "unknown", getStatus(obj))
    }

    protected abstract fun getStatus(obj: O): String

}