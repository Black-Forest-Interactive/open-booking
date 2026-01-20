package de.sambalmueslie.openbooking.infrastructure.event.handler

import de.sambalmueslie.openbooking.common.Entity
import de.sambalmueslie.openbooking.common.EntityChangeListener
import de.sambalmueslie.openbooking.infrastructure.event.EventService
import de.sambalmueslie.openbooking.infrastructure.event.api.ChangeEventType
import kotlin.reflect.KClass

abstract class EntityChangeHandler<T, O : Entity<T>>(
    private val type: KClass<O>,
    private val queue: EventService
) : EntityChangeListener<T, O> {


    final override fun handleCreated(obj: O) {
        publishEvent(ChangeEventType.CREATE, obj)
    }

    final override fun handleUpdated(obj: O) {
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