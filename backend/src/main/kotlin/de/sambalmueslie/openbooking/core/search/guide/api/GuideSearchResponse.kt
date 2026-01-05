package de.sambalmueslie.openbooking.core.search.guide.api

import de.sambalmueslie.openbooking.core.guide.api.Guide
import de.sambalmueslie.openbooking.core.search.common.SearchResponse
import io.micronaut.data.model.Page

data class GuideSearchResponse(
    override val result: Page<Guide>
) : SearchResponse<Guide>
