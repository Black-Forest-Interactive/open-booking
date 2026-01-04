package de.sambalmueslie.openbooking.core.search.offer

import com.fasterxml.jackson.module.kotlin.readValue
import com.jillesvangurp.ktsearch.SearchResponse
import com.jillesvangurp.ktsearch.total
import de.sambalmueslie.openbooking.common.BusinessObjectChangeListener
import de.sambalmueslie.openbooking.config.OpenSearchConfig
import de.sambalmueslie.openbooking.core.booking.api.BookingDetails
import de.sambalmueslie.openbooking.core.offer.OfferService
import de.sambalmueslie.openbooking.core.offer.api.Offer
import de.sambalmueslie.openbooking.core.offer.api.OfferDetails
import de.sambalmueslie.openbooking.core.offer.assembler.OfferDetailsAssembler
import de.sambalmueslie.openbooking.core.reservation.api.ReservationDetails
import de.sambalmueslie.openbooking.core.search.common.BaseOpenSearchOperator
import de.sambalmueslie.openbooking.core.search.common.SearchClientFactory
import de.sambalmueslie.openbooking.core.search.common.SearchRequest
import de.sambalmueslie.openbooking.core.search.offer.api.OfferSearchEntry
import de.sambalmueslie.openbooking.core.search.offer.api.OfferSearchRequest
import de.sambalmueslie.openbooking.core.search.offer.api.OfferSearchResponse
import de.sambalmueslie.openbooking.core.search.offer.db.OfferBookingEntryData
import de.sambalmueslie.openbooking.core.search.offer.db.OfferReservationEntryData
import de.sambalmueslie.openbooking.core.search.offer.db.OfferSearchEntryData
import io.micronaut.data.model.Page
import io.micronaut.data.model.Pageable
import jakarta.inject.Singleton
import org.slf4j.LoggerFactory

@Singleton
open class OfferSearchOperator(
    service: OfferService,
    private val detailsAssembler: OfferDetailsAssembler,

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
        service.register(object : BusinessObjectChangeListener<Long, Offer> {
            override fun handleCreated(obj: Offer) {
                handleChanged(obj)
            }

            override fun handleUpdated(obj: Offer) {
                handleChanged(obj)
            }

            override fun handleDeleted(obj: Offer) {
                deleteDocument(obj.id.toString())
            }
        })
    }

    private fun handleChanged(offer: Offer) {
        val details = detailsAssembler.getDetail(offer.id) ?: return
        val data = convert(details)
        updateDocument(data)
    }

    override fun initialLoadPage(pageable: Pageable): Page<Pair<String, String>> {
        val page = detailsAssembler.getAllDetails(pageable)
        return page.map { convert(it) }
    }

    private fun convert(obj: OfferDetails): Pair<String, String> {
        val input = OfferSearchEntryData(
            obj.offer.id,
            obj.offer.start,
            obj.offer.finish,
            obj.offer.maxPersons,
            obj.offer.active,
            obj.assignment.bookedSpace,
            obj.assignment.reservedSpace,
            obj.assignment.availableSpace,
            obj.reservations.map { convert(it) },
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


    private fun convert(info: ReservationDetails): OfferReservationEntryData {
        return OfferReservationEntryData(
            info.reservation.id,
            info.reservation.status,
            info.visitor.id,
            info.visitor.type,
            info.visitor.title,
            info.visitor.description,
            info.visitor.size,
            info.visitor.minAge,
            info.visitor.maxAge,
            info.visitor.name,
            info.visitor.address.street,
            info.visitor.address.city,
            info.visitor.address.zip,
            info.visitor.phone,
            info.visitor.email,
            info.visitor.verification.status,
            info.visitor.verification.timestamp
        )
    }

    override fun processSearchResponse(request: SearchRequest, response: SearchResponse, pageable: Pageable): OfferSearchResponse {
        val result = response.hits?.hits?.mapNotNull { hit ->
            hit.source?.let { source ->
                mapper.readValue<OfferSearchEntryData>(source.toString()).convert()
            }
        } ?: emptyList()

        return OfferSearchResponse(Page.of(result, pageable, response.total))
    }
}