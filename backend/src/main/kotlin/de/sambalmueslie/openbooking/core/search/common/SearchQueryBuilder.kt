package de.sambalmueslie.openbooking.core.search.common

import com.jillesvangurp.searchdsls.querydsl.SearchDSL
import io.micronaut.data.model.Pageable

interface SearchQueryBuilder<R : SearchRequest> {
    fun buildSearchQuery(pageable: Pageable, request: R): SearchDSL.() -> Unit
}