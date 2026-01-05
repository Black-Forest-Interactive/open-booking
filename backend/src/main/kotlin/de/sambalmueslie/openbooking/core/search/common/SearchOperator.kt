package de.sambalmueslie.openbooking.core.search.common

import io.micronaut.data.model.Pageable

interface SearchOperator<T, R : SearchRequest, S : SearchResponse<T>> {
    fun key(): String
    fun info(): SearchOperatorInfo
    fun setup()
    fun search(request: R, pageable: Pageable): S
}