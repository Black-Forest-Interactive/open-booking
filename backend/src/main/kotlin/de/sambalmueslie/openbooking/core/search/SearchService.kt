package de.sambalmueslie.openbooking.core.search

import de.sambalmueslie.openbooking.core.search.common.SearchOperator
import de.sambalmueslie.openbooking.core.search.common.SearchOperatorInfo
import de.sambalmueslie.openbooking.core.search.common.SearchRequest
import de.sambalmueslie.openbooking.core.search.common.SearchResponse
import io.micronaut.data.model.Pageable
import jakarta.inject.Singleton

@Singleton
class SearchService(
    private val operators: List<SearchOperator<Any, SearchRequest, SearchResponse<Any>>>
) {

    @Suppress("UNCHECKED_CAST")
    fun <T, R : SearchRequest, S : SearchResponse<T>> search(key: String, request: R, pageable: Pageable): S? {
        val operator = (findOperator(key) as? SearchOperator<T, R, S>) ?: return null
        return operator.search(request, pageable)
    }

    fun getInfo() = operators.map { it.info() }
    fun getInfo(key: String) = findOperator(key)?.info()

    fun setup(key: String): SearchOperatorInfo? {
        val operator = findOperator(key) ?: return null
        operator.setup()
        return operator.info()
    }

    private fun findOperator(key: String): SearchOperator<*, *, *>? {
        return operators.find { it.info().key == key }
    }
}