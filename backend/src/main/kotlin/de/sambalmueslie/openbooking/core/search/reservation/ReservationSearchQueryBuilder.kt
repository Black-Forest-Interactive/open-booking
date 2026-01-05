package de.sambalmueslie.openbooking.core.search.reservation

import com.jillesvangurp.searchdsls.querydsl.*
import de.sambalmueslie.openbooking.core.search.common.SearchQueryBuilder
import de.sambalmueslie.openbooking.core.search.reservation.api.ReservationSearchRequest
import de.sambalmueslie.openbooking.core.search.reservation.db.ReservationOfferEntryData
import de.sambalmueslie.openbooking.core.search.reservation.db.ReservationSearchEntryData
import io.micronaut.data.model.Pageable
import jakarta.inject.Singleton
import kotlin.reflect.KProperty

@Singleton
class ReservationSearchQueryBuilder : SearchQueryBuilder<ReservationSearchRequest> {

    // Helper function to create nested field path
    private fun nestedField(parent: KProperty<*>, child: KProperty<*>) = "${parent.name}.${child.name}"

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
                must(
                    nested {
                        path = ReservationSearchEntryData::offers.name
                        query = bool {
                            request.from?.let { fromDate ->
                                must(
                                    range(nestedField(ReservationSearchEntryData::offers, ReservationOfferEntryData::finish)) {
                                        gte = fromDate.toString()
                                    }
                                )
                            }

                            request.to?.let { toDate ->
                                must(
                                    range(nestedField(ReservationSearchEntryData::offers, ReservationOfferEntryData::start)) {
                                        lte = toDate.toString()
                                    }
                                )
                            }
                        }
                    }
                )
            }

            // If no search criteria, match all
            if (searchTerm.isBlank() && request.status.isEmpty() && request.from == null && request.to == null) {
                must(matchAll())
            }
        }
    }
}