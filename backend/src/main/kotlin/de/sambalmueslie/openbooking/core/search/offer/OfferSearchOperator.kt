package de.sambalmueslie.openbooking.core.search.offer

import com.fasterxml.jackson.module.kotlin.readValue
import com.jillesvangurp.ktsearch.*
import de.sambalmueslie.openbooking.config.OpenSearchConfig
import de.sambalmueslie.openbooking.core.booking.BookingChangeListener
import de.sambalmueslie.openbooking.core.booking.BookingService
import de.sambalmueslie.openbooking.core.booking.api.Booking
import de.sambalmueslie.openbooking.core.booking.api.BookingChangeRequest
import de.sambalmueslie.openbooking.core.booking.api.BookingConfirmationContent
import de.sambalmueslie.openbooking.core.booking.api.BookingDetails
import de.sambalmueslie.openbooking.core.booking.assembler.BookingDetailsAssembler
import de.sambalmueslie.openbooking.core.offer.OfferChangeListener
import de.sambalmueslie.openbooking.core.offer.OfferService
import de.sambalmueslie.openbooking.core.offer.api.Offer
import de.sambalmueslie.openbooking.core.offer.api.OfferChangeRequest
import de.sambalmueslie.openbooking.core.offer.api.OfferDetails
import de.sambalmueslie.openbooking.core.offer.assembler.OfferDetailsAssembler
import de.sambalmueslie.openbooking.core.offer.assembler.OfferInfoAssembler
import de.sambalmueslie.openbooking.core.search.common.BaseOpenSearchOperator
import de.sambalmueslie.openbooking.core.search.common.SearchClientFactory
import de.sambalmueslie.openbooking.core.search.common.SearchRequest
import de.sambalmueslie.openbooking.core.search.offer.api.*
import de.sambalmueslie.openbooking.core.search.offer.db.OfferBookingEntryData
import de.sambalmueslie.openbooking.core.search.offer.db.OfferSearchEntryData
import io.micronaut.data.model.Page
import io.micronaut.data.model.Pageable
import jakarta.inject.Singleton
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.double
import kotlinx.serialization.json.jsonPrimitive
import org.slf4j.LoggerFactory
import java.time.LocalDateTime
import java.time.ZonedDateTime
import kotlin.system.measureTimeMillis

@Singleton
open class OfferSearchOperator(
    private val service: OfferService,
    bookingService: BookingService,

    private val infoAssembler: OfferInfoAssembler,
    private val detailsAssembler: OfferDetailsAssembler,
    private val bookingDetailsAssembler: BookingDetailsAssembler,

    private val fieldMapping: OfferFieldMappingProvider,
    private val queryBuilder: OfferSearchQueryBuilder,
    config: OpenSearchConfig,
    openSearch: SearchClientFactory
) : BaseOpenSearchOperator<OfferSearchEntry, OfferSearchRequest, OfferSearchResponse>(openSearch, "offer", config, logger) {
    companion object {
        private val logger = LoggerFactory.getLogger(OfferSearchOperator::class.java)
    }

    override fun getFieldMappingProvider() = fieldMapping
    override fun getSearchQueryBuilder() = queryBuilder


    init {
        service.register(object : OfferChangeListener {
            override fun handleCreated(obj: Offer, request: OfferChangeRequest) {
                processChange(obj)
            }

            override fun handleUpdated(obj: Offer, request: OfferChangeRequest) {
                processChange(obj)
            }

            override fun handlePatched(obj: Offer) {
                processChange(obj)
            }

            override fun handleBlockCreated(offers: List<Offer>) {
                processChange(offers)
            }

            override fun handleBlockUpdated(offers: List<Offer>) {
                processChange(offers)
            }

            override fun handleDeleted(obj: Offer) {
                deleteDocument(obj.id.toString())
            }
        })


        bookingService.register(object : BookingChangeListener {
            override fun handleCreated(obj: Booking, request: BookingChangeRequest) {
                processChange(obj)
            }

            override fun handleUpdated(obj: Booking, request: BookingChangeRequest) {
                processChange(obj)
            }

            override fun handlePatched(obj: Booking) {
                processChange(obj)
            }

            override fun handleDeleted(obj: Booking) {
                processDelete(obj)
            }

            override fun canceled(booking: Booking) {
                processChange(booking)
            }

            override fun confirmed(booking: Booking, content: BookingConfirmationContent) {
                processChange(booking)
            }

            override fun declined(booking: Booking, content: BookingConfirmationContent) {
                processChange(booking)
            }
        })
    }

    private fun processChange(booking: Booking) {
        updateOffer(booking.offerId)
    }

    private fun processDelete(booking: Booking) {
        updateOffer(booking.offerId)
    }

    private fun processChange(offer: Offer) {
        updateOffer(offer.id)
    }

    private fun processChange(offers: List<Offer>) {
        val offerIds = offers.map { it.id }.toSet()
        val details = detailsAssembler.getByIds(offerIds)
        val duration = measureTimeMillis {
            details.forEach { detail -> updateDocument(convert(detail), false) }
        }
        logger.debug("Update offer ${offers.size} took $duration ms")
    }

    private fun updateOffer(offerId: Long) {
        val details = detailsAssembler.get(offerId) ?: return
        val duration = measureTimeMillis {
            val data = convert(details)
            updateDocument(data)
        }
        logger.debug("Update offer $offerId took $duration ms")
    }

    override fun initialLoadPage(pageable: Pageable): Page<Pair<String, String>> {
        val page = detailsAssembler.getAll(pageable)
        return page.map { convert(it) }
    }

    private fun convert(obj: OfferDetails): Pair<String, String> {
        val input = OfferSearchEntryData(
            obj.offer.id,
            obj.offer.start,
            obj.offer.finish,
            obj.offer.maxPersons,
            obj.offer.active,
            obj.assignment.confirmedSpace,
            obj.assignment.pendingSpace,
            obj.assignment.availableSpace,
            obj.offer.created,
            obj.offer.updated,
            obj.offer.updated ?: obj.offer.created,
            obj.bookings.map { convert(it) }

        )
        return Pair(input.id.toString(), mapper.writeValueAsString(input))
    }

    private fun convert(obj: BookingDetails): OfferBookingEntryData {
        return OfferBookingEntryData(
            obj.booking.id,
            obj.booking.status,
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
            obj.visitor.verification.timestamp
        )
    }


    override fun processSearchResponse(request: SearchRequest, response: SearchResponse, pageable: Pageable): OfferSearchResponse {
        val result = response.hits?.hits?.mapNotNull { hit ->
            hit.source?.let { source ->
                mapper.readValue<OfferSearchEntryData>(source.toString())
            }
        } ?: emptyList()

        val offerIds = response.ids.map { it.toLong() }.toSet()
        val infos = infoAssembler.getByIds(offerIds).associateBy { it.offer.id }
        val bookings = bookingDetailsAssembler.getByOfferIds(offerIds).associateBy { it.booking.id }

        val content = result.mapNotNull {
            val info = infos[it.id] ?: return@mapNotNull null
            it.convert(info, bookings)
        }

        return OfferSearchResponse(Page.of(content, pageable, response.total))
    }

    fun searchGroupedByDay(request: OfferSearchRequest): List<OfferGroupedSearchResult> {
        val from = request.from ?: service.getFirstOffer()?.start ?: LocalDateTime.now()
        val to = request.to ?: from.plusDays(7)

        val response = search(OfferSearchRequest(request.fullTextSearch, from, to), Pageable.from(0, 10000))
        val content = response.result.groupBy { it.info.offer.start.toLocalDate() }
            .map { OfferGroupedSearchResult(it.key, it.value.sortedBy { v -> v.info.offer.start }) }
            .sortedBy { it.day }
        return content
    }

    fun findSuitableOffer(request: OfferFindSuitableRequest): OfferFindSuitableResponse {
        val response = search(queryBuilder.buildSearchQuery(request))

        val data = response.hits?.hits?.mapNotNull { hit ->
            hit.source?.let { source ->
                mapper.readValue<OfferSearchEntryData>(source.toString())
            }
        } ?: emptyList()

        val result = data.map { it.toReference() }.groupBy { it.offer.start.toLocalDate() }
            .map { OfferFindSuitableResponseEntry(it.key, it.value.sortedBy { v -> v.offer.start }) }
            .sortedBy { it.day }
        return OfferFindSuitableResponse(result)
    }

    fun getOfferStatistics(): OfferStatistics {
        val response = search(queryBuilder.getOfferStatistics())

        // Parse active offers total space
        val activeOffersJson = response.aggregations?.get("active_offers") as? JsonObject
        val totalAvailableSpaceJson = activeOffersJson?.get("total_available_space") as? JsonObject
        val totalActiveOfferSpace = totalAvailableSpaceJson?.get("value")?.jsonPrimitive?.double?.toLong() ?: 0L

        // Parse inactive offers total space
        val inactiveOffersJson = response.aggregations?.get("inactive_offers") as? JsonObject
        val totalDeactivatedSpaceJson = inactiveOffersJson?.get("total_deactivated_space") as? JsonObject
        val totalDeactivatedOfferSpace = totalDeactivatedSpaceJson?.get("value")?.jsonPrimitive?.double?.toLong() ?: 0L

        // Parse offers by day
        val offersByDay = response.aggregations
            .dateHistogramResult("offers_by_day")
            .parsedBuckets.map { bucket ->
                DailyOfferStats(
                    date = ZonedDateTime.parse(bucket.parsed.keyAsString).toLocalDate(),
                    count = bucket.parsed.docCount
                )
            }

        // Parse space by day
        val spaceByDay = response.aggregations
            .dateHistogramResult("space_by_day")
            .parsedBuckets.map { bucket ->
                val totalSpaceJson = bucket.aggregations["total_space"] as? JsonObject
                val confirmedSpaceJson = bucket.aggregations["confirmed_space"] as? JsonObject
                val pendingSpaceJson = bucket.aggregations["pending_space"] as? JsonObject
                val availableSpaceJson = bucket.aggregations["available_space"] as? JsonObject

                DailySpaceStats(
                    date = ZonedDateTime.parse(bucket.parsed.keyAsString).toLocalDate(),
                    totalSpace = totalSpaceJson?.get("value")?.jsonPrimitive?.double?.toLong() ?: 0L,
                    confirmedSpace = confirmedSpaceJson?.get("value")?.jsonPrimitive?.double?.toLong() ?: 0L,
                    pendingSpace = pendingSpaceJson?.get("value")?.jsonPrimitive?.double?.toLong() ?: 0L,
                    availableSpace = availableSpaceJson?.get("value")?.jsonPrimitive?.double?.toLong() ?: 0L
                )
            }

        // Parse simple aggregations
        val avgConfirmedJson = response.aggregations?.get("avg_confirmed_space") as? JsonObject
        val avgConfirmedSpace = avgConfirmedJson?.get("value")?.jsonPrimitive?.double ?: 0.0

        val avgPendingJson = response.aggregations?.get("avg_pending_space") as? JsonObject
        val avgPendingSpace = avgPendingJson?.get("value")?.jsonPrimitive?.double ?: 0.0

        val avgAvailableJson = response.aggregations?.get("avg_available_space") as? JsonObject
        val avgAvailableSpace = avgAvailableJson?.get("value")?.jsonPrimitive?.double ?: 0.0

        val totalMaxSpaceJson = response.aggregations?.get("total_max_space") as? JsonObject
        val totalMaxSpace = totalMaxSpaceJson?.get("value")?.jsonPrimitive?.double?.toLong() ?: 0L

        val totalConfirmedSpaceJson = response.aggregations?.get("total_confirmed_space") as? JsonObject
        val totalConfirmedSpace = totalConfirmedSpaceJson?.get("value")?.jsonPrimitive?.double?.toLong() ?: 0L

        val totalPendingSpaceJson = response.aggregations?.get("total_pending_space") as? JsonObject
        val totalPendingSpace = totalPendingSpaceJson?.get("value")?.jsonPrimitive?.double?.toLong() ?: 0L

//        val totalAvailableSpaceJson = response.aggregations?.get("total_available_space") as? JsonObject
        val totalAvailableSpace = totalAvailableSpaceJson?.get("value")?.jsonPrimitive?.double?.toLong() ?: 0L

        return OfferStatistics(
            totalActiveOfferSpace = totalActiveOfferSpace,
            totalDeactivatedOfferSpace = totalDeactivatedOfferSpace,
            offersByDay = offersByDay,
            spaceByDay = spaceByDay,
            avgConfirmedSpace = avgConfirmedSpace,
            avgPendingSpace = avgPendingSpace,
            avgAvailableSpace = avgAvailableSpace,
            totalMaxSpace = totalMaxSpace,
            totalConfirmedSpace = totalConfirmedSpace,
            totalPendingSpace = totalPendingSpace,
            totalAvailableSpace = totalAvailableSpace
        )
    }

}