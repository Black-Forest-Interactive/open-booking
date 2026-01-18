package de.sambalmueslie.openbooking.common

import kotlin.reflect.KClass

open class EntityException(type: KClass<*>, code: Int, msg: String, payload: String) : RuntimeException(msg) {
}