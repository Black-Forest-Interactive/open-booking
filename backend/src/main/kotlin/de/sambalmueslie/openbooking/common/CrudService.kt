package de.sambalmueslie.openbooking.common

import io.micronaut.data.model.Page
import io.micronaut.data.model.Pageable


interface CrudService<T, O : Entity<T>, R : EntityChangeRequest, L : EntityChangeListener<T, O, R>> {
    fun get(id: T): O?
    fun getAll(pageable: Pageable): Page<O>
    fun create(request: R): O
    fun update(id: T, request: R): O
    fun delete(id: T): O?

    fun register(listener: L)
    fun unregister(listener: L)
}
