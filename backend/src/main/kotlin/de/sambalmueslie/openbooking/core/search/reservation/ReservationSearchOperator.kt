package de.sambalmueslie.openbooking.core.search.reservation

import com.fasterxml.jackson.module.kotlin.readValue
import com.jillesvangurp.ktsearch.SearchResponse
import com.jillesvangurp.ktsearch.total
import de.sambalmueslie.openbooking.config.OpenSearchConfig
import de.sambalmueslie.openbooking.core.reservation.ReservationChangeListener
import de.sambalmueslie.openbooking.core.reservation.ReservationService
import de.sambalmueslie.openbooking.core.reservation.api.Reservation
import de.sambalmueslie.openbooking.core.reservation.api.ReservationDetails
import de.sambalmueslie.openbooking.core.reservation.assembler.ReservationDetailsAssembler
import de.sambalmueslie.openbooking.core.search.common.BaseOpenSearchOperator
import de.sambalmueslie.openbooking.core.search.common.SearchClientFactory
import de.sambalmueslie.openbooking.core.search.common.SearchRequest
import de.sambalmueslie.openbooking.core.search.reservation.api.ReservationSearchRequest
import de.sambalmueslie.openbooking.core.search.reservation.api.ReservationSearchResponse
import de.sambalmueslie.openbooking.core.search.reservation.db.ReservationSearchEntryData
import de.sambalmueslie.openbooking.core.visitor.VisitorChangeListener
import de.sambalmueslie.openbooking.core.visitor.VisitorService
import de.sambalmueslie.openbooking.core.visitor.api.Visitor
import io.micronaut.data.model.Page
import io.micronaut.data.model.Pageable
import jakarta.inject.Singleton
import org.slf4j.LoggerFactory

@Singleton
open class ReservationSearchOperator(
    private val service: ReservationService, private val visitorService: VisitorService, private val detailAssembler: ReservationDetailsAssembler,

    private val fieldMapping: ReservationFieldMappingProvider, private val queryBuilder: ReservationSearchQueryBuilder, config: OpenSearchConfig, openSearch: SearchClientFactory

) : BaseOpenSearchOperator<ReservationDetails, ReservationSearchRequest, ReservationSearchResponse>(openSearch, "reservation", config, logger) {
    companion object {
        private val logger = LoggerFactory.getLogger(ReservationSearchOperator::class.java)
    }

    override fun getFieldMappingProvider() = fieldMapping
    override fun getSearchQueryBuilder() = queryBuilder


    init {
        service.register(object : ReservationChangeListener {
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

    private fun handleChanged(reservation: Reservation) {
        val details = detailAssembler.get(reservation.id) ?: return
        handleChanged(details)
    }

    private fun handleChanged(details: ReservationDetails, blocking: Boolean = false) {
        val data = convert(details)
        updateDocument(data, blocking)
    }

    override fun initialLoadPage(pageable: Pageable): Page<Pair<String, String>> {
        val page = detailAssembler.getAll(pageable)
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
            obj.offer.offer.id,
            obj.offer.offer.start,
            obj.offer.offer.finish,
            obj.offer.offer.maxPersons,
            obj.offer.offer.active,
            obj.offer.assignment.bookedSpace,
            obj.offer.assignment.reservedSpace,
            obj.offer.assignment.availableSpace

        )
        return Pair(input.id, mapper.writeValueAsString(input))
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