package de.sambalmueslie.openbooking.core.search.offer

import com.jillesvangurp.searchdsls.querydsl.*
import de.sambalmueslie.openbooking.core.search.common.SearchQueryBuilder
import de.sambalmueslie.openbooking.core.search.offer.api.OfferSearchRequest
import de.sambalmueslie.openbooking.core.search.offer.db.OfferBookingEntryData
import de.sambalmueslie.openbooking.core.search.offer.db.OfferSearchEntryData
import io.micronaut.data.model.Pageable
import jakarta.inject.Singleton

@Singleton
class OfferSearchQueryBuilder : SearchQueryBuilder<OfferSearchRequest> {
    override fun buildSearchQuery(
        pageable: Pageable,
        request: OfferSearchRequest,
    ): (SearchDSL.() -> Unit) = {
        from = pageable.offset.toInt()
        resultSize = pageable.size
        trackTotalHits = "true"

        query = bool {
            // Full-text search
            val searchTerm = request.fullTextSearch.trim()
            if (searchTerm.isNotBlank()) {
                should(
                    // Search in nested booking fields
                    nested {
                        path = OfferSearchEntryData::bookings.name
                        query = bool {
                            should(
                                match("${OfferSearchEntryData::bookings.name}.${OfferBookingEntryData::name.name}", searchTerm) {
                                    fuzziness = "AUTO"
                                    boost = 2.0
                                },
                                match("${OfferSearchEntryData::bookings.name}.${OfferBookingEntryData::title.name}", searchTerm) {
                                    fuzziness = "AUTO"
                                    boost = 2.0
                                },
                                match("${OfferSearchEntryData::bookings.name}.${OfferBookingEntryData::description.name}", searchTerm) {
                                    fuzziness = "AUTO"
                                    boost = 1.5
                                },
                                match("${OfferSearchEntryData::bookings.name}.${OfferBookingEntryData::email.name}", searchTerm) {
                                    fuzziness = "AUTO"
                                    boost = 1.0
                                }
                            )
                        }
                    }
                )
                minimumShouldMatch(1)
            }

            // Date range filters - these apply to top-level fields
            request.from?.let { fromDate ->
                must(
                    range(OfferSearchEntryData::finish) {
                        gte = fromDate.toString()
                    }
                )
            }

            request.to?.let { toDate ->
                must(
                    range(OfferSearchEntryData::start) {
                        lte = toDate.toString()
                    }
                )
            }

            // If no search term, match all
            if (searchTerm.isBlank() && request.from == null && request.to == null) {
                must(matchAll())
            }
        }
        sort {
            add(OfferSearchEntryData::start, SortOrder.ASC)  // Group by start
            add(OfferSearchEntryData::timestamp, SortOrder.DESC)  // Then by timestamp
        }
    }
}