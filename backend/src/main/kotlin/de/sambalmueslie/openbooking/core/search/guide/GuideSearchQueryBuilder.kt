package de.sambalmueslie.openbooking.core.search.guide

import com.jillesvangurp.searchdsls.querydsl.*
import de.sambalmueslie.openbooking.core.search.common.SearchQueryBuilder
import de.sambalmueslie.openbooking.core.search.guide.api.GuideSearchRequest
import io.micronaut.data.model.Pageable
import jakarta.inject.Singleton

@Singleton
class GuideSearchQueryBuilder : SearchQueryBuilder<GuideSearchRequest> {
    override fun buildSearchQuery(
        pageable: Pageable,
        request: GuideSearchRequest,
    ): (SearchDSL.() -> Unit) = {
        from = pageable.offset.toInt()
        resultSize = pageable.size
        trackTotalHits = "true"
        query =
            bool {
                val searchTerm = request.fullTextSearch
                if (searchTerm.isNotBlank()) {
                    should(
                        match(GuideSearchEntryData::firstName.name, searchTerm) {
                            fuzziness = "AUTO"
                            boost = 2.0  // Higher weight for firstName
                        },
                        match(GuideSearchEntryData::lastName.name, searchTerm) {
                            fuzziness = "AUTO"
                            boost = 2.0  // Higher weight for lastName
                        },
                        match(GuideSearchEntryData::email.name, searchTerm) {
                            fuzziness = "AUTO"
                            boost = 1.0  // Normal weight for email
                        }
                    )
                    minimumShouldMatch(1)
                } else {
                    matchAll()
                }
            }
        sort {
            add(GuideSearchEntryData::name, SortOrder.DESC)
            add(GuideSearchEntryData::timestamp, SortOrder.DESC)
        }
    }
}