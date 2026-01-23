package de.sambalmueslie.openbooking.core.search.booking

import com.jillesvangurp.ktsearch.*
import com.jillesvangurp.searchdsls.querydsl.TermsAgg
import com.jillesvangurp.searchdsls.querydsl.agg
import com.jillesvangurp.searchdsls.querydsl.bool
import com.jillesvangurp.searchdsls.querydsl.terms
import de.sambalmueslie.openbooking.config.OpenSearchConfig
import de.sambalmueslie.openbooking.core.booking.BookingChangeListener
import de.sambalmueslie.openbooking.core.booking.BookingService
import de.sambalmueslie.openbooking.core.booking.api.Booking
import de.sambalmueslie.openbooking.core.booking.api.BookingConfirmationContent
import de.sambalmueslie.openbooking.core.booking.api.BookingDetails
import de.sambalmueslie.openbooking.core.booking.api.BookingStatus
import de.sambalmueslie.openbooking.core.booking.assembler.BookingDetailsAssembler
import de.sambalmueslie.openbooking.core.search.booking.api.BookingSearchRequest
import de.sambalmueslie.openbooking.core.search.booking.api.BookingSearchResponse
import de.sambalmueslie.openbooking.core.search.common.BaseOpenSearchOperator
import de.sambalmueslie.openbooking.core.search.common.SearchClientFactory
import de.sambalmueslie.openbooking.core.search.common.SearchRequest
import de.sambalmueslie.openbooking.core.visitor.VisitorChangeListener
import de.sambalmueslie.openbooking.core.visitor.VisitorService
import de.sambalmueslie.openbooking.core.visitor.api.Visitor
import io.micronaut.data.model.Page
import io.micronaut.data.model.Pageable
import jakarta.inject.Singleton
import org.slf4j.LoggerFactory

@Singleton
open class BookingSearchOperator(
    private val service: BookingService,
    private val visitorService: VisitorService,
    private val detailAssembler: BookingDetailsAssembler,

    private val fieldMapping: BookingFieldMappingProvider, private val queryBuilder: BookingSearchQueryBuilder, config: OpenSearchConfig, openSearch: SearchClientFactory

) : BaseOpenSearchOperator<BookingDetails, BookingSearchRequest, BookingSearchResponse>(openSearch, "bookings", config, logger) {
    companion object {
        private val logger = LoggerFactory.getLogger(BookingSearchOperator::class.java)
    }

    override fun getFieldMappingProvider() = fieldMapping
    override fun getSearchQueryBuilder() = queryBuilder


    init {
        service.register(object : BookingChangeListener {
            override fun handleCreated(obj: Booking) {
                handleChanged(obj, true)
            }

            override fun handleUpdated(obj: Booking) {
                handleChanged(obj, true)
            }

            override fun handleDeleted(obj: Booking) {
                deleteDocument(obj.id.toString())
            }

            override fun canceled(booking: Booking) {
                handleChanged(booking, true)
            }

            override fun confirmed(booking: Booking, content: BookingConfirmationContent) {
                handleChanged(booking, true)
            }

            override fun declined(booking: Booking, content: BookingConfirmationContent) {
                handleChanged(booking, true)
            }
        })

        visitorService.register(object : VisitorChangeListener {
            override fun handleCreated(obj: Visitor) {
                handleChanged(obj)
            }

            override fun handleUpdated(obj: Visitor) {
                handleChanged(obj)
            }

            override fun handleDeleted(obj: Visitor) {
                handleChanged(obj)
            }
        })
    }

    private fun handleChanged(visitor: Visitor) {
        val details = detailAssembler.getByVisitorId(visitor.id)
        details.forEach { handleChanged(it) }
    }

    private fun handleChanged(reservation: Booking, blocking: Boolean = false) {
        val details = detailAssembler.get(reservation.id) ?: return
        handleChanged(details, blocking)
    }

    private fun handleChanged(details: BookingDetails, blocking: Boolean = false) {
        val data = convert(details)
        updateDocument(data, blocking)
    }

    override fun initialLoadPage(pageable: Pageable): Page<Pair<String, String>> {
        val page = detailAssembler.getAll(pageable)
        return page.map { convert(it) }
    }

    private fun convert(obj: BookingDetails): Pair<String, String> {
        val input = BookingSearchEntryData(
            obj.booking.id.toString(),
            obj.booking.key,
            obj.booking.status,
            obj.booking.size,
            obj.booking.comment,
            obj.booking.lang,
            obj.timestamp,
            obj.visitor.id,
            obj.visitor.type,
            obj.visitor.title,
            obj.visitor.description,
            obj.visitor.size,
            obj.visitor.minAge,
            obj.visitor.maxAge,
            obj.visitor.name,
            obj.visitor.address.street,
            obj.visitor.address.city,
            obj.visitor.address.zip,
            obj.visitor.phone,
            obj.visitor.email,
            obj.visitor.verification.status,
            obj.visitor.verification.timestamp,
            obj.offer.offer.id,
            obj.offer.offer.start,
            obj.offer.offer.finish,
            obj.offer.offer.maxPersons,
            obj.offer.offer.active,
            obj.offer.assignment.confirmedSpace,
            obj.offer.assignment.pendingSpace,
            obj.offer.assignment.availableSpace

        )
        return Pair(input.id, mapper.writeValueAsString(input))
    }

    override fun processSearchResponse(request: SearchRequest, response: SearchResponse, pageable: Pageable): BookingSearchResponse {
        val ids = response.ids.mapNotNull { it.toLongOrNull() }.toSet()
        val result = detailAssembler.getByIds(ids)
        return BookingSearchResponse(Page.of(result, pageable, response.total), getStatusMap())
    }

    fun getStatusMap(): Map<BookingStatus, Long> {
        val response = search {
            resultSize = 0
            agg(BookingSearchEntryData::status.name, TermsAgg(BookingSearchEntryData::status))
        }
        return response.aggregations.termsResult(BookingSearchEntryData::status.name)
            .parsedBuckets.mapNotNull { tagBucket ->
                val status = try {
                    BookingStatus.valueOf(tagBucket.parsed.key)
                } catch (e: Exception) {
                    logger.error("Cannot parse status ${tagBucket.parsed.key}", e)
                    return@mapNotNull null
                }
                Pair(status, tagBucket.parsed.docCount)
            }.toMap()
    }

    fun getPendingAmount(): Long {
        val result = search {
            query = bool {
                must(
                    terms(BookingSearchEntryData::status, BookingStatus.PENDING.toString())
                )
            }
        }
        return result.total
    }

}