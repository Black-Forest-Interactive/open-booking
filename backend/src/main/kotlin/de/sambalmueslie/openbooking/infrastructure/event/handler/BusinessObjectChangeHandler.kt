package de.sambalmueslie.openbooking.infrastructure.event.handler

import de.sambalmueslie.openbooking.common.BusinessObject
import de.sambalmueslie.openbooking.common.BusinessObjectChangeListener
import de.sambalmueslie.openbooking.infrastructure.event.EventService
import de.sambalmueslie.openbooking.infrastructure.event.api.ChangeEventType
import kotlin.reflect.KClass

abstract class BusinessObjectChangeHandler<T, O : BusinessObject<T>>(
    private val type: KClass<O>,
    private val queue: EventService
) : BusinessObjectChangeListener<T, O> {


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