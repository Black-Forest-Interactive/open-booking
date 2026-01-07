package de.sambalmueslie.openbooking.core.search.reservation

import com.jillesvangurp.searchdsls.querydsl.*
import de.sambalmueslie.openbooking.core.search.common.SearchQueryBuilder
import de.sambalmueslie.openbooking.core.search.reservation.api.ReservationSearchRequest
import de.sambalmueslie.openbooking.core.search.reservation.db.ReservationSearchEntryData
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
        query = bool {
            // Full-text search across visitor fields
            val searchTerm = request.fullTextSearch.trim()
            if (searchTerm.isNotBlank()) {
                should(
                    match(ReservationSearchEntryData::name, searchTerm) {
                        fuzziness = "AUTO"
                        boost = 2.0
                    },
                    match(ReservationSearchEntryData::title, searchTerm) {
                        fuzziness = "AUTO"
                        boost = 2.0
                    },
                    match(ReservationSearchEntryData::description, searchTerm) {
                        fuzziness = "AUTO"
                        boost = 1.5
                    },
                    // Email: fuzzy match on text field
                    match(ReservationSearchEntryData::email, searchTerm) {
                        fuzziness = "AUTO"
                        boost = 1.0
                    },
                    // Email: wildcard match on keyword field for partial matching
                    wildcard("${ReservationSearchEntryData::email.name}.keyword", "*${searchTerm.lowercase()}*") {
                        boost = 1.5
                    },
                    match(ReservationSearchEntryData::phone, searchTerm) {
                        fuzziness = "AUTO"
                        boost = 1.0
                    },
                    match(ReservationSearchEntryData::comment, searchTerm) {
                        fuzziness = "AUTO"
                        boost = 0.5
                    }
                )
                minimumShouldMatch(1)
            }

            // Filter by reservation status
            if (request.status.isNotEmpty()) {
                must(
                    terms(ReservationSearchEntryData::status, request.status.map { it.name })
                )
            }

            // Date range filters on nested offer fields
            if (request.from != null || request.to != null) {
                request.from?.let { fromDate ->
                    must(
                        range(ReservationSearchEntryData::start) {
                            gte = fromDate.toString()
                        }
                    )
                }

                request.to?.let { toDate ->
                    must(
                        range(ReservationSearchEntryData::start) {
                            lte = toDate.toString()
                        }
                    )
                }
            }

            // If no search criteria, match all
            if (searchTerm.isBlank() && request.status.isEmpty() && request.from == null && request.to == null) {
                must(matchAll())
            }
        }
    }
}