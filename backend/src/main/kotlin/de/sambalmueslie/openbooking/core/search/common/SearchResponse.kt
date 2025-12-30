package de.sambalmueslie.openbooking.core.search.common

import io.micronaut.data.model.Page

interface SearchResponse<T> {
    val result: Page<T>
}