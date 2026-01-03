package de.sambalmueslie.openbooking.core.reservation

import de.sambalmueslie.openbooking.core.offer.OfferService
import de.sambalmueslie.openbooking.core.offer.api.Offer
import de.sambalmueslie.openbooking.core.reservation.api.ReservationInfo
import de.sambalmueslie.openbooking.core.reservation.db.ReservationData
import de.sambalmueslie.openbooking.core.reservation.db.ReservationOfferRelation
import de.sambalmueslie.openbooking.core.reservation.db.ReservationOfferRelationRepository
import de.sambalmueslie.openbooking.core.visitor.VisitorService
import de.sambalmueslie.openbooking.core.visitor.api.Visitor
import io.micronaut.data.model.Page
import jakarta.inject.Singleton
import org.slf4j.LoggerFactory

@Singleton
class ReservationConverter(
    private val offerService: OfferService,
    private val visitorService: VisitorService,
    private val relationRepository: ReservationOfferRelationRepository,
) {
    companion object {
        private val logger = LoggerFactory.getLogger(ReservationConverter::class.java)
    }

    fun page(provider: () -> Page<ReservationData>): Page<ReservationInfo> {
        return info(provider.invoke())
    }

    fun list(provider: () -> List<ReservationData>): List<ReservationInfo> {
        return info(provider.invoke())
    }

    fun data(provider: () -> ReservationData?): ReservationInfo? {
        val data = provider.invoke() ?: return null
        return info(data)
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

        return data.mapNotNull { info(it, relations, offers, visitors) }
            .sortedBy { it.visitor.verification.status.order }
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
}