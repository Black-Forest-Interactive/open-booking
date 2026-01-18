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
        queue.publishEvent(ChangeEventType.CREATE, obj.id.toString(), type.simpleName ?: "unknown")
    }

    final override fun handleUpdated(obj: O) {
        queue.publishEvent(ChangeEventType.UPDATE, obj.id.toString(), type.simpleName ?: "unknown")
    }

    final override fun handleDeleted(obj: O) {
        queue.publishEvent(ChangeEventType.DELETE, obj.id.toString(), type.simpleName ?: "unknown")
    }

}