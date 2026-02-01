package de.sambalmueslie.openbooking.core.search.offer

import com.jillesvangurp.searchdsls.querydsl.*
import de.sambalmueslie.openbooking.core.search.common.SearchQueryBuilder
import de.sambalmueslie.openbooking.core.search.offer.api.OfferFindSuitableRequest
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
                    range(OfferSearchEntryData::start) {
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

    fun buildSearchQuery(request: OfferFindSuitableRequest): (SearchDSL.() -> Unit) = {
        resultSize = 500
        query = bool {
            must(
                range(OfferSearchEntryData::availableSpace) {
                    gte = request.visitorSize
                }
            )

            request.from?.let { fromDate ->
                must(
                    range(OfferSearchEntryData::start) {
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
        }
        sort {
            add(OfferSearchEntryData::start, SortOrder.ASC)  // Group by start
            add(OfferSearchEntryData::timestamp, SortOrder.DESC)  // Then by timestamp
        }
    }

    fun getOfferStatistics(): (SearchDSL.() -> Unit) = {
        resultSize = 0

        // Total available space in active offers
        val activeOffersAgg = FilterAgg(TermQuery(OfferSearchEntryData::active.name, true))
        activeOffersAgg.agg("total_available_space", SumAgg(OfferSearchEntryData::maxPersons))
        agg("active_offers", activeOffersAgg)

        // Total space in inactive offers
        val inactiveOffersAgg = FilterAgg(TermQuery(OfferSearchEntryData::active.name, false))
        inactiveOffersAgg.agg("total_deactivated_space", SumAgg(OfferSearchEntryData::maxPersons))
        agg("inactive_offers", inactiveOffersAgg)

        // Offers created by day
        agg("offers_by_day", DateHistogramAgg(OfferSearchEntryData::created) {
            calendarInterval = "day"
        })

        // Available space by day
        agg("space_by_day", DateHistogramAgg(OfferSearchEntryData::start) {
            calendarInterval = "day"
        }) {
            agg("total_space", SumAgg(OfferSearchEntryData::maxPersons))
            agg("confirmed_space", SumAgg(OfferSearchEntryData::confirmedSpace))
            agg("pending_space", SumAgg(OfferSearchEntryData::pendingSpace))
            agg("available_space", SumAgg(OfferSearchEntryData::availableSpace))
        }

        // Average utilization
        agg("avg_confirmed_space", AvgAgg(OfferSearchEntryData::confirmedSpace))
        agg("avg_pending_space", AvgAgg(OfferSearchEntryData::pendingSpace))
        agg("avg_available_space", AvgAgg(OfferSearchEntryData::availableSpace))

        // Total spaces
        agg("total_max_space", SumAgg(OfferSearchEntryData::maxPersons))
        agg("total_confirmed_space", SumAgg(OfferSearchEntryData::confirmedSpace))
        agg("total_pending_space", SumAgg(OfferSearchEntryData::pendingSpace))
        agg("total_available_space", SumAgg(OfferSearchEntryData::availableSpace))
    }
}