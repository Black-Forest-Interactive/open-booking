package de.sambalmueslie.openbooking.common

interface DataObject<T : BusinessObject<*>> {
	fun convert(): T
}
