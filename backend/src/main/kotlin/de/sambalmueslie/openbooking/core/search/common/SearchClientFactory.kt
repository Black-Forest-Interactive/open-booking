package de.sambalmueslie.openbooking.core.search.common

import com.jillesvangurp.ktsearch.SearchClient

interface SearchClientFactory {
    fun getClient(): SearchClient
}