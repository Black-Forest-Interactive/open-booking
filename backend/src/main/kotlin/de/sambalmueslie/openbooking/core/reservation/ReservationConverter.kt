package de.sambalmueslie.openbooking.core.reservation

import de.sambalmueslie.openbooking.core.offer.OfferService
import de.sambalmueslie.openbooking.core.offer.api.Offer
import de.sambalmueslie.openbooking.core.reservation.api.ReservationDetails
import de.sambalmueslie.openbooking.core.reservation.api.ReservationInfo
import de.sambalmueslie.openbooking.core.reservation.api.ReservationOfferEntry
import de.sambalmueslie.openbooking.core.reservation.db.ReservationData
import de.sambalmueslie.openbooking.core.reservation.db.ReservationOfferRelation
import de.sambalmueslie.openbooking.core.reservation.db.ReservationOfferRelationRepository
import de.sambalmueslie.openbooking.core.reservation.db.ReservationRepository
import de.sambalmueslie.openbooking.core.visitor.VisitorService
import de.sambalmueslie.openbooking.core.visitor.api.Visitor
import io.micronaut.data.model.Page
import jakarta.inject.Singleton
import org.slf4j.LoggerFactory

@Singleton
class ReservationConverter(
    private val offerService: OfferService,
    private val visitorService: VisitorService,
    private val repository: ReservationRepository,
    private val relationRepository: ReservationOfferRelationRepository,
) {
    companion object {
        private val logger = LoggerFactory.getLogger(ReservationConverter::class.java)
    }


    fun pageToInfo(provider: () -> Page<ReservationData>): Page<ReservationInfo> {
        return info(provider.invoke())
    }

    fun listToInfo(provider: () -> List<ReservationData>): List<ReservationInfo> {
        return info(provider.invoke())
    }

    fun dataToInfo(provider: () -> ReservationData?): ReservationInfo? {
        val data = provider.invoke() ?: return null
        return info(data)
    }

    fun relationsToInfo(provider: () -> List<ReservationOfferRelation>): List<ReservationInfo> {
        return relationInfo(provider.invoke())
    }

    private fun info(data: Page<ReservationData>): Page<ReservationInfo> {
        val result = info(data.content)
        return Page.of(result, data.pageable, data.totalSize)
    }

    private fun info(data: List<ReservationData>): List<ReservationInfo> {
        val reservationIds = data.map { it.id }
        val relations = relationRepository.findByIdReservationIdIn(reservationIds).groupBy { it.id.reservationId }

        val offerIds = relations.map { it.value.map { it.id.offerId } }.flatten().toSet()
        val offers = offerService.getOffer(offerIds).associateBy { it.id }

        val visitorIds = data.map { it.visitorId }.toSet()
        val visitors = visitorService.getVisitors(visitorIds).associateBy { it.id }

        return data.mapNotNull { info(it, relations, offers, visitors) }.sortedBy { it.visitor.verification.status.order }
    }

    private fun relationInfo(relations: List<ReservationOfferRelation>): List<ReservationInfo> {
        val reservationIds = relations.map { it.id.reservationId }.toSet()
        val data = repository.findByIdIn(reservationIds)
        return info(data)
    }

    private fun info(data: ReservationData, relations: Map<Long, List<ReservationOfferRelation>>, offers: Map<Long, Offer>, visitors: Map<Long, Visitor>): ReservationInfo? {
        val visitor = visitors[data.visitorId] ?: return null
        val relation = relations[data.id] ?: return null

        return info(data, visitor, relation, offers)
    }

    private fun info(data: ReservationData): ReservationInfo? {
        val relations = relationRepository.findByIdReservationIdOrderByPriority(data.id)
        val offers = offerService.getOffer(relations.map { it.id.offerId }.toSet()).associateBy { it.id }

        val visitor = visitorService.get(data.visitorId) ?: return null
        return info(data, visitor, relations, offers)
    }

    private fun info(data: ReservationData, visitor: Visitor, relations: List<ReservationOfferRelation>, offers: Map<Long, Offer>): ReservationInfo {
        val timestamp = data.updated ?: data.created
        return ReservationInfo(data.id, visitor, relations.mapNotNull { offers[it.id.offerId] }, data.status, data.comment, timestamp)
    }

    fun pageToDetails(provider: () -> Page<ReservationData>): Page<ReservationDetails> {
        return details(provider.invoke())
    }

    fun listToDetails(provider: () -> List<ReservationData>): List<ReservationDetails> {
        return details(provider.invoke())
    }

    fun dataToDetails(provider: () -> ReservationData?): ReservationDetails? {
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
        val reservationIds = data.map { it.id }
        val relations = relationRepository.findByIdReservationIdIn(reservationIds).groupBy { it.id.reservationId }
        return details(data, relations)
    }

    private fun relationDetails(relations: List<ReservationOfferRelation>): List<ReservationDetails> {
        val relationsByReservationId = relations.groupBy { it.id.reservationId }
        val data = repository.findByIdIn(relationsByReservationId.keys)
        return details(data, relationsByReservationId)
    }

    private fun details(data: List<ReservationData>, relations: Map<Long, List<ReservationOfferRelation>>): List<ReservationDetails> {
        val visitorIds = data.map { it.visitorId }.toSet()
        val visitors = visitorService.getVisitors(visitorIds).associateBy { it.id }

        return data.mapNotNull { details(it, relations, visitors) }.sortedBy { it.visitor.verification.status.order }
    }

    private fun details(data: ReservationData, relations: Map<Long, List<ReservationOfferRelation>>, visitors: Map<Long, Visitor>): ReservationDetails? {
        val visitor = visitors[data.visitorId] ?: return null
        val relation = relations[data.id] ?: return null

        return details(data, visitor, relation)
    }

    private fun details(data: ReservationData): ReservationDetails? {
        val relations = relationRepository.findByIdReservationIdOrderByPriority(data.id)
        val visitor = visitorService.get(data.visitorId) ?: return null
        return details(data, visitor, relations)
    }


    private fun details(data: ReservationData, visitor: Visitor, relations: List<ReservationOfferRelation>): ReservationDetails {
        val timestamp = data.updated ?: data.created
        return ReservationDetails(data.convert(), visitor, relations.map { ReservationOfferEntry(it.id.offerId, it.priority) }, timestamp)
    }

}

