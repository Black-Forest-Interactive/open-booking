package de.sambalmueslie.openbooking.core.search.offer

import com.fasterxml.jackson.module.kotlin.readValue
import com.jillesvangurp.ktsearch.SearchResponse
import com.jillesvangurp.ktsearch.total
import de.sambalmueslie.openbooking.common.BusinessObjectChangeListener
import de.sambalmueslie.openbooking.config.OpenSearchConfig
import de.sambalmueslie.openbooking.core.booking.BookingService
import de.sambalmueslie.openbooking.core.booking.api.BookingInfo
import de.sambalmueslie.openbooking.core.booking.api.BookingStatus
import de.sambalmueslie.openbooking.core.offer.OfferService
import de.sambalmueslie.openbooking.core.offer.api.Offer
import de.sambalmueslie.openbooking.core.offer.api.OfferInfo
import de.sambalmueslie.openbooking.core.reservation.ReservationService
import de.sambalmueslie.openbooking.core.reservation.api.ReservationInfo
import de.sambalmueslie.openbooking.core.reservation.api.ReservationStatus
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
class OfferSearchOperator(
    private val service: OfferService,

    private val bookingService: BookingService, private val reservationService: ReservationService,

    private val fieldMapping: OfferFieldMappingProvider, private val queryBuilder: OfferSearchQueryBuilder, config: OpenSearchConfig, openSearch: SearchClientFactory
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
        val info = service.getInfo(offer.id) ?: return
        val bookings = bookingService.getBookingInfoByOfferId(offer.id)
        val reservations = reservationService.getReservationInfoByOfferId(offer.id)
        val data = convert(info, reservations, bookings)
        updateDocument(data)
    }

    override fun initialLoadPage(pageable: Pageable): Page<Pair<String, String>> {
        val page = service.getAllInfos(pageable)
        val offerIds = page.content.map { it.offer.id }.toSet()
        val bookings = bookingService.getBookingInfoByOfferIds(offerIds).groupBy { it.offer.id }
        val reservations = reservationService.getReservationInfoByOfferIds(offerIds).flatMap { info -> info.offer.map { offer -> offer.id to info } }.groupBy({ it.first }, { it.second })

        return page.map { convert(it, reservations[it.offer.id] ?: emptyList(), bookings[it.offer.id] ?: emptyList()) }
    }

    private fun convert(obj: OfferInfo, reservations: List<ReservationInfo>, bookings: List<BookingInfo>): Pair<String, String> {

        var reservedSeats: Int = 0
        val reservationEntries = reservations.map {
            if (it.status == ReservationStatus.UNCONFIRMED) reservedSeats += it.visitor.size
            convert(it)
        }

        var bookedSeats: Int = 0
        val bookingEntries = bookings.map {
            if (it.status == BookingStatus.CONFIRMED) bookedSeats += it.visitor.size
            convert(it)
        }

        val input = OfferSearchEntryData(
            obj.offer.id,
            obj.offer.start,
            obj.offer.finish,
            obj.offer.maxPersons,
            obj.offer.active,
            bookedSeats,
            reservedSeats,
            obj.offer.maxPersons - bookedSeats - reservedSeats,
            reservationEntries,
            bookingEntries

        )
        return Pair(input.id.toString(), mapper.writeValueAsString(input))
    }

    private fun convert(info: BookingInfo): OfferBookingEntryData {
        return OfferBookingEntryData(
            info.id,
            info.status,
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


    private fun convert(info: ReservationInfo): OfferReservationEntryData {
        return OfferReservationEntryData(
            info.id,
            info.status,
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