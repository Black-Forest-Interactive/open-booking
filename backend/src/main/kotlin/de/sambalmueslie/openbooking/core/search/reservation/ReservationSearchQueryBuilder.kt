package de.sambalmueslie.openbooking.core.search.reservation

import com.jillesvangurp.searchdsls.querydsl.SearchDSL
import com.jillesvangurp.searchdsls.querydsl.bool
import com.jillesvangurp.searchdsls.querydsl.match
import com.jillesvangurp.searchdsls.querydsl.matchAll
import de.sambalmueslie.openbooking.core.search.common.SearchQueryBuilder
import de.sambalmueslie.openbooking.core.search.reservation.api.ReservationSearchRequest
import io.micronaut.data.model.Pageable
import jakarta.inject.Singleton

@Singleton
class ReservationSearchQueryBuilder : SearchQueryBuilder<ReservationSearchRequest> {
    override fun buildSearchQuery(
        pageable: Pageable,
        request: ReservationSearchRequest,
    ): (SearchDSL.() -> Unit) = {
        from = pageable.offset.toInt()
        resultSize = pageable.size
        trackTotalHits = "true"
        query =
            bool {
                val searchTerm = request.fullTextSearch
                if (searchTerm.isNotBlank()) {
                    should(
                        match(ReservationSearchEntryData::name, searchTerm) {
                            fuzziness = "AUTO"
                            boost = 2.0  // Higher weight for name
                        },
                        match(ReservationSearchEntryData::title, searchTerm) {
                            fuzziness = "AUTO"
                            boost = 2.0  // Higher weight for title
                        },
                        match(ReservationSearchEntryData::email, searchTerm) {
                            fuzziness = "AUTO"
                            boost = 1.0  // Normal weight for email
                        }
                    )
                    minimumShouldMatch(1)
                } else {
                    matchAll()
                }
            }
    }
}