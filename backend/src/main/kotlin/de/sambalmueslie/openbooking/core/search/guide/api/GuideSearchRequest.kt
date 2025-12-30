package de.sambalmueslie.openbooking.core.search.guide.api

import de.sambalmueslie.openbooking.core.search.common.SearchRequest

data class GuideSearchRequest(
    val fullTextSearch: String,
) : SearchRequest