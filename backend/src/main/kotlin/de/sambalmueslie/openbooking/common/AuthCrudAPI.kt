package de.sambalmueslie.openbooking.common

import io.micronaut.data.model.Page
import io.micronaut.data.model.Pageable
import io.micronaut.security.authentication.Authentication

interface AuthCrudAPI<T, O : Entity<T>, R : EntityChangeRequest> {
    fun get(auth: Authentication, id: T): O?
    fun getAll(auth: Authentication, pageable: Pageable): Page<O>
    fun create(auth: Authentication, request: R): O
    fun update(auth: Authentication, id: T, request: R): O
    fun delete(auth: Authentication, id: T): O?
}
