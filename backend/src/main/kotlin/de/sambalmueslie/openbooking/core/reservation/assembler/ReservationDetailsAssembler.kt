package de.sambalmueslie.openbooking.core.reservation.assembler

import de.sambalmueslie.openbooking.common.findByIdOrNull
import de.sambalmueslie.openbooking.core.offer.api.OfferDetails
import de.sambalmueslie.openbooking.core.offer.assembler.OfferDetailsAssembler
import de.sambalmueslie.openbooking.core.reservation.api.ReservationDetails
import de.sambalmueslie.openbooking.core.reservation.api.ReservationOffer
import de.sambalmueslie.openbooking.core.reservation.db.ReservationData
import de.sambalmueslie.openbooking.core.reservation.db.ReservationRepository
import de.sambalmueslie.openbooking.core.visitor.VisitorService
import de.sambalmueslie.openbooking.core.visitor.api.Visitor
import io.micronaut.data.model.Page
import io.micronaut.data.model.Pageable
import jakarta.inject.Singleton
import org.slf4j.LoggerFactory

@Singleton
class ReservationDetailsAssembler(
    private val repository: ReservationRepository,

    private val offerService: OfferDetailsAssembler,
    private val visitorService: VisitorService,
) {
    companion object {
        private val logger = LoggerFactory.getLogger(ReservationDetailsAssembler::class.java)
    }

    fun getAll(pageable: Pageable): Page<ReservationDetails> {
        return pageToDetails { repository.findAll(pageable) }
    }

    fun get(id: Long): ReservationDetails? {
        return dataToDetails { repository.findByIdOrNull(id) }
    }

    fun getByIds(ids: Set<Long>): List<ReservationDetails> {
        return listToDetails { repository.findByIdIn(ids) }
    }

    fun getByOfferId(offerId: Long): List<ReservationDetails> {
        return listToDetails { repository.findByOfferId(offerId) }
    }

    fun getByOfferIds(offerIds: Set<Long>): List<ReservationDetails> {
        return listToDetails { repository.findByOfferIdIn(offerIds) }
    }

    fun getByVisitorId(visitorId: Long): List<ReservationDetails> {
        return listToDetails { repository.findByVisitorId(visitorId) }
    }

    fun getByVisitorIdIn(visitorIds: Set<Long>): List<ReservationDetails> {
        return listToDetails { repository.findByVisitorIdIn(visitorIds) }
    }

    private fun pageToDetails(provider: () -> Page<ReservationData>): Page<ReservationDetails> {
        return details(provider.invoke())
    }

    private fun listToDetails(provider: () -> List<ReservationData>): List<ReservationDetails> {
        return details(provider.invoke())
    }

    private fun dataToDetails(provider: () -> ReservationData?): ReservationDetails? {
        val data = provider.invoke() ?: return null
        return details(data)
    }

    private fun details(data: Page<ReservationData>): Page<ReservationDetails> {
        val result = details(data.content)
        return Page.of(result, data.pageable, data.totalSize)
    }

    private fun details(data: List<ReservationData>): List<ReservationDetails> {
        val offerIds = data.map { it.offerId }.toSet()
        val offers = offerService.getByIds(offerIds).associateBy { it.offer.id }
        return details(data, offers)
    }

    private fun details(data: List<ReservationData>, offers: Map<Long, OfferDetails>): List<ReservationDetails> {
        val visitorIds = data.map { it.visitorId }.toSet()
        val visitors = visitorService.getVisitors(visitorIds).associateBy { it.id }

        return data.mapNotNull { details(it, visitors, offers) }.sortedBy { it.visitor.verification.status.order }
    }

    private fun details(data: ReservationData, visitors: Map<Long, Visitor>, offers: Map<Long, OfferDetails>): ReservationDetails? {
        val visitor = visitors[data.visitorId] ?: return null
        return details(data, visitor, offers)
    }

    private fun details(data: ReservationData): ReservationDetails? {
        val visitor = visitorService.get(data.visitorId) ?: return null
        val offer = offerService.get(data.offerId) ?: return null
        return details(data, visitor, offer)
    }


    private fun details(data: ReservationData, visitor: Visitor, offers: Map<Long, OfferDetails>): ReservationDetails? {
        val timestamp = data.updated ?: data.created
        val offer = offers[data.offerId] ?: return null
        return details(data, visitor, offer)
    }

    private fun details(data: ReservationData, visitor: Visitor, offer: OfferDetails): ReservationDetails? {
        val timestamp = data.updated ?: data.created
        val o = ReservationOffer(offer.offer, offer.assignment)
        return ReservationDetails(data.convert(), visitor, o, timestamp)
    }

}