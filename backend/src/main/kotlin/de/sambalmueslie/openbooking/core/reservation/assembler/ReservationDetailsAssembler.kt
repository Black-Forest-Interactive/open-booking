package de.sambalmueslie.openbooking.core.reservation.assembler

import de.sambalmueslie.openbooking.common.findByIdOrNull
import de.sambalmueslie.openbooking.core.offer.api.OfferDetails
import de.sambalmueslie.openbooking.core.offer.assembler.OfferDetailsAssembler
import de.sambalmueslie.openbooking.core.reservation.ReservationRelationService
import de.sambalmueslie.openbooking.core.reservation.api.ReservationDetails
import de.sambalmueslie.openbooking.core.reservation.api.ReservationOfferEntry
import de.sambalmueslie.openbooking.core.reservation.db.ReservationData
import de.sambalmueslie.openbooking.core.reservation.db.ReservationOfferRelation
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
    private val relationService: ReservationRelationService,

    private val offerService: OfferDetailsAssembler,
    private val visitorService: VisitorService,
) {
    companion object {
        private val logger = LoggerFactory.getLogger(ReservationDetailsAssembler::class.java)
    }

    fun getAllDetails(pageable: Pageable): Page<ReservationDetails> {
        return pageToDetails { repository.findAll(pageable) }
    }

    fun getDetail(id: Long): ReservationDetails? {
        return dataToDetails { repository.findByIdOrNull(id) }
    }

    fun getDetailByIds(ids: Set<Long>): List<ReservationDetails> {
        return listToDetails { repository.findByIdIn(ids) }
    }

    fun getDetailByOfferId(offerId: Long): List<ReservationDetails> {
        return listToDetails { repository.findByIdIn(relationService.getIdsByOfferId(offerId)) }
    }

    fun getDetailByOfferIds(offerIds: Set<Long>): List<ReservationDetails> {
        return listToDetails { repository.findByIdIn(relationService.getIdsByOfferIds(offerIds)) }
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

    fun relationsToDetails(provider: () -> List<ReservationOfferRelation>): List<ReservationDetails> {
        return relationDetails(provider.invoke())
    }

    private fun details(data: Page<ReservationData>): Page<ReservationDetails> {
        val result = details(data.content)
        return Page.of(result, data.pageable, data.totalSize)
    }

    private fun details(data: List<ReservationData>): List<ReservationDetails> {
        val relations = relationService.get(data)
        val offerIds = relations.map { it.value.map { it.id.offerId } }.flatten().toSet()
        val offers = offerService.getDetailByIds(offerIds).associateBy { it.offer.id }
        return details(data, relations, offers)
    }

    private fun relationDetails(relations: List<ReservationOfferRelation>): List<ReservationDetails> {
        val relationsByReservationId = relations.groupBy { it.id.reservationId }
        val offerIds = relations.map { it.id.offerId }.toSet()
        val offers = offerService.getDetailByIds(offerIds).associateBy { it.offer.id }
        val data = repository.findByIdIn(relationsByReservationId.keys)
        return details(data, relationsByReservationId, offers)
    }

    private fun details(data: List<ReservationData>, relations: Map<Long, List<ReservationOfferRelation>>, offers: Map<Long, OfferDetails>): List<ReservationDetails> {
        val visitorIds = data.map { it.visitorId }.toSet()
        val visitors = visitorService.getVisitors(visitorIds).associateBy { it.id }

        return data.mapNotNull { details(it, relations, visitors, offers) }.sortedBy { it.visitor.verification.status.order }
    }

    private fun details(data: ReservationData, relations: Map<Long, List<ReservationOfferRelation>>, visitors: Map<Long, Visitor>, offers: Map<Long, OfferDetails>): ReservationDetails? {
        val visitor = visitors[data.visitorId] ?: return null
        val relation = relations[data.id] ?: return null

        return details(data, visitor, relation, offers)
    }

    private fun details(data: ReservationData): ReservationDetails? {
        val relations = relationService.getOrderByPriority(data)
        val visitor = visitorService.get(data.visitorId) ?: return null
        val offerIds = relations.map { it.id.offerId }.toSet()
        val offers = offerService.getDetailByIds(offerIds).associateBy { it.offer.id }
        return details(data, visitor, relations, offers)
    }


    private fun details(data: ReservationData, visitor: Visitor, relations: List<ReservationOfferRelation>, offers: Map<Long, OfferDetails>): ReservationDetails {
        val timestamp = data.updated ?: data.created
        val offers = relations.mapNotNull {
            val offer = offers[it.id.offerId] ?: return@mapNotNull null
            ReservationOfferEntry(offer.offer, offer.assignment, it.priority)
        }
        return ReservationDetails(data.convert(), visitor, offers, timestamp)
    }

}