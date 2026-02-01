package de.sambalmueslie.openbooking.core.search.booking

import com.jillesvangurp.searchdsls.querydsl.*
import de.sambalmueslie.openbooking.core.search.booking.api.BookingSearchRequest
import de.sambalmueslie.openbooking.core.search.common.SearchQueryBuilder
import de.sambalmueslie.openbooking.core.visitor.api.VerificationStatus
import io.micronaut.data.model.Pageable
import jakarta.inject.Singleton

@Singleton
class BookingSearchQueryBuilder : SearchQueryBuilder<BookingSearchRequest> {

    override fun buildSearchQuery(
        pageable: Pageable,
        request: BookingSearchRequest,
    ): (SearchDSL.() -> Unit) = {
        from = pageable.offset.toInt()
        resultSize = pageable.size
        trackTotalHits = "true"
        query = bool {
            // Full-text search across visitor fields
            val searchTerm = request.fullTextSearch.trim()
            if (searchTerm.isNotBlank()) {
                should(
                    match(BookingSearchEntryData::name, searchTerm) {
                        fuzziness = "AUTO"
                        boost = 2.0
                    },
                    // Add prefix matching for partial word matches
                    matchPhrasePrefix(BookingSearchEntryData::name, searchTerm) {
                        boost = 2.5
                    },
                    match(BookingSearchEntryData::title, searchTerm) {
                        fuzziness = "AUTO"
                        boost = 2.0
                    },
                    // Add prefix matching for partial word matches
                    matchPhrasePrefix(BookingSearchEntryData::title, searchTerm) {
                        boost = 2.5
                    },
                    match(BookingSearchEntryData::description, searchTerm) {
                        fuzziness = "AUTO"
                        boost = 1.5
                    },
                    // Email: fuzzy match on text field
                    match(BookingSearchEntryData::email, searchTerm) {
                        fuzziness = "AUTO"
                        boost = 1.0
                    },
                    // Email: wildcard match on keyword field for partial matching
                    wildcard("${BookingSearchEntryData::email.name}.keyword", "*${searchTerm.lowercase()}*") {
                        boost = 1.5
                    },
                    match(BookingSearchEntryData::phone, searchTerm) {
                        fuzziness = "AUTO"
                        boost = 1.0
                    },
                    match(BookingSearchEntryData::comment, searchTerm) {
                        fuzziness = "AUTO"
                        boost = 0.5
                    }
                )
                minimumShouldMatch(1)
            }

            // Filter by reservation status
            if (request.status.isNotEmpty()) {
                must(
                    terms(BookingSearchEntryData::status, request.status.map { it.name })
                )
            }

            if (request.onlyMailConfirmed != null) {
                if (request.onlyMailConfirmed) {
                    must(
                        terms(BookingSearchEntryData::verificationStatus, VerificationStatus.CONFIRMED.toString())
                    )
                } else {
                    // not implemented yet
                }
            }

            // Date range filters on nested offer fields
            if (request.from != null || request.to != null) {
                request.from?.let { fromDate ->
                    must(
                        range(BookingSearchEntryData::start) {
                            gte = fromDate.toString()
                        }
                    )
                }

                request.to?.let { toDate ->
                    must(
                        range(BookingSearchEntryData::start) {
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
        sort {
            add(BookingSearchEntryData::start, SortOrder.ASC)  // Group by start
            add(BookingSearchEntryData::timestamp, SortOrder.DESC)  // Then by timestamp
        }
        agg(BookingSearchEntryData::status.name, TermsAgg(BookingSearchEntryData::status))
    }

    fun getBookingStatistics(): (SearchDSL.() -> Unit) = {
        resultSize = 0

        // Status distribution with total seats per status
        agg(BookingSearchEntryData::status.name, TermsAgg(BookingSearchEntryData::status).apply {
            agg("total_seats", SumAgg(BookingSearchEntryData::size))
        })

        // Bookings created by day
        agg("bookings_by_day", DateHistogramAgg(BookingSearchEntryData::created) {
            calendarInterval = "day"
        })

        // Seats created by day - need to create separately for nested agg
        val seatsByDayAgg = DateHistogramAgg(BookingSearchEntryData::created) {
            calendarInterval = "day"
        }
        seatsByDayAgg.agg("total_seats", SumAgg(BookingSearchEntryData::size))
        agg("seats_by_day", seatsByDayAgg)

        // Additional useful stats
        agg(BookingSearchEntryData::type.name, TermsAgg(BookingSearchEntryData::type))

        agg(BookingSearchEntryData::verificationStatus.name, TermsAgg(BookingSearchEntryData::verificationStatus))

        agg("avg_booking_size", AvgAgg(BookingSearchEntryData::size))

        agg("total_seats", SumAgg(BookingSearchEntryData::size))

        // Popular offers with seats
        val popularOffersAgg = TermsAgg(BookingSearchEntryData::offerId)
        popularOffersAgg.agg("total_seats", SumAgg(BookingSearchEntryData::size))
        agg("popular_offers", popularOffersAgg)
    }
}