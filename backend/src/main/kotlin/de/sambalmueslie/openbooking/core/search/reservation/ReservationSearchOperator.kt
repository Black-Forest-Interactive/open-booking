package de.sambalmueslie.openbooking.core.search.reservation

import com.fasterxml.jackson.module.kotlin.readValue
import com.jillesvangurp.ktsearch.SearchResponse
import com.jillesvangurp.ktsearch.total
import de.sambalmueslie.openbooking.common.BusinessObjectChangeListener
import de.sambalmueslie.openbooking.config.OpenSearchConfig
import de.sambalmueslie.openbooking.core.reservation.ReservationService
import de.sambalmueslie.openbooking.core.reservation.api.Reservation
import de.sambalmueslie.openbooking.core.reservation.api.ReservationDetails
import de.sambalmueslie.openbooking.core.reservation.api.ReservationOfferEntry
import de.sambalmueslie.openbooking.core.reservation.assembler.ReservationDetailsAssembler
import de.sambalmueslie.openbooking.core.search.common.BaseOpenSearchOperator
import de.sambalmueslie.openbooking.core.search.common.SearchClientFactory
import de.sambalmueslie.openbooking.core.search.common.SearchRequest
import de.sambalmueslie.openbooking.core.search.reservation.api.ReservationSearchEntry
import de.sambalmueslie.openbooking.core.search.reservation.api.ReservationSearchRequest
import de.sambalmueslie.openbooking.core.search.reservation.api.ReservationSearchResponse
import de.sambalmueslie.openbooking.core.search.reservation.db.ReservationOfferEntryData
import de.sambalmueslie.openbooking.core.search.reservation.db.ReservationSearchEntryData
import io.micronaut.data.model.Page
import io.micronaut.data.model.Pageable
import jakarta.inject.Singleton
import org.slf4j.LoggerFactory

@Singleton
open class ReservationSearchOperator(
    private val service: ReservationService,
    private val detailAssembler: ReservationDetailsAssembler,

    private val fieldMapping: ReservationFieldMappingProvider,
    private val queryBuilder: ReservationSearchQueryBuilder,
    config: OpenSearchConfig,
    openSearch: SearchClientFactory

) : BaseOpenSearchOperator<ReservationSearchEntry, ReservationSearchRequest, ReservationSearchResponse>(openSearch, "reservation", config, logger) {
    companion object {
        private val logger = LoggerFactory.getLogger(ReservationSearchOperator::class.java)
    }

    override fun getFieldMappingProvider() = fieldMapping
    override fun getSearchQueryBuilder() = queryBuilder


    init {
        service.register(object : BusinessObjectChangeListener<Long, Reservation> {
            override fun handleCreated(obj: Reservation) {
                handleChanged(obj)
            }

            override fun handleUpdated(obj: Reservation) {
                handleChanged(obj)
            }

            override fun handleDeleted(obj: Reservation) {
                deleteDocument(obj.id.toString())
            }
        })
    }

    private fun handleChanged(reservation: Reservation) {
        val details = detailAssembler.getDetail(reservation.id) ?: return
        val data = convert(details)
        updateDocument(data)
    }

    override fun initialLoadPage(pageable: Pageable): Page<Pair<String, String>> {
        val page = detailAssembler.getAllDetails(pageable)
        return page.map { convert(it) }
    }

    private fun convert(obj: ReservationDetails): Pair<String, String> {
        val input = ReservationSearchEntryData(
            obj.reservation.id.toString(),
            obj.reservation.key,
            obj.reservation.status,
            obj.reservation.comment,
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
            obj.offers.map { convert(it) }
        )
        return Pair(input.id, mapper.writeValueAsString(input))
    }

    private fun convert(obj: ReservationOfferEntry): ReservationOfferEntryData {
        return ReservationOfferEntryData(
            obj.offer.id,
            obj.offer.start,
            obj.offer.finish,
            obj.offer.maxPersons,
            obj.offer.active,
            obj.assignment.bookedSpace,
            obj.assignment.reservedSpace,
            obj.assignment.availableSpace,
            obj.priority
        )
    }

    override fun processSearchResponse(request: SearchRequest, response: SearchResponse, pageable: Pageable): ReservationSearchResponse {
        val result = response.hits?.hits?.mapNotNull { hit ->
            hit.source?.let { source ->
                mapper.readValue<ReservationSearchEntryData>(source.toString()).convert()
            }
        } ?: emptyList()

        return ReservationSearchResponse(Page.of(result, pageable, response.total))
    }

}