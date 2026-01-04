package de.sambalmueslie.openbooking.core.reservation.assembler

import de.sambalmueslie.openbooking.common.findByIdOrNull
import de.sambalmueslie.openbooking.core.reservation.ReservationRelationService
import de.sambalmueslie.openbooking.core.reservation.api.ReservationInfo
import de.sambalmueslie.openbooking.core.reservation.api.ReservationOfferReference
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
class ReservationInfoAssembler(
    private val repository: ReservationRepository,
    private val relationService: ReservationRelationService,
    private val visitorService: VisitorService,
) {
    companion object {
        private val logger = LoggerFactory.getLogger(ReservationInfoAssembler::class.java)
    }

    fun getAll(pageable: Pageable): Page<ReservationInfo> {
        return pageToInfo { repository.findAll(pageable) }
    }

    fun get(id: Long): ReservationInfo? {
        return dataToInfo { repository.findByIdOrNull(id) }
    }

    fun getByIds(ids: Set<Long>): List<ReservationInfo> {
        return listToInfo { repository.findByIdIn(ids) }
    }

    fun getByOfferId(offerId: Long): List<ReservationInfo> {
        return listToInfo { repository.findByIdIn(relationService.getIdsByOfferId(offerId)) }
    }

    fun getByOfferIds(offerIds: Set<Long>): List<ReservationInfo> {
        return listToInfo { repository.findByIdIn(relationService.getIdsByOfferIds(offerIds)) }
    }

    private fun pageToInfo(provider: () -> Page<ReservationData>): Page<ReservationInfo> {
        return info(provider.invoke())
    }

    private fun listToInfo(provider: () -> List<ReservationData>): List<ReservationInfo> {
        return info(provider.invoke())
    }

    private fun dataToInfo(provider: () -> ReservationData?): ReservationInfo? {
        val data = provider.invoke() ?: return null
        return info(data)
    }

    private fun relationsToInfo(provider: () -> List<ReservationOfferRelation>): List<ReservationInfo> {
        return relationInfo(provider.invoke())
    }

    private fun info(data: Page<ReservationData>): Page<ReservationInfo> {
        val result = info(data.content)
        return Page.of(result, data.pageable, data.totalSize)
    }

    private fun info(data: List<ReservationData>): List<ReservationInfo> {
        val relations = relationService.get(data)

        val visitorIds = data.map { it.visitorId }.toSet()
        val visitors = visitorService.getVisitors(visitorIds).associateBy { it.id }

        return data.mapNotNull { info(it, relations, visitors) }.sortedBy { it.visitor.verification.status.order }
    }

    private fun relationInfo(relations: List<ReservationOfferRelation>): List<ReservationInfo> {
        val reservationIds = relations.map { it.id.reservationId }.toSet()
        val data = repository.findByIdIn(reservationIds)
        return info(data)
    }

    private fun info(data: ReservationData, relations: Map<Long, List<ReservationOfferRelation>>, visitors: Map<Long, Visitor>): ReservationInfo? {
        val visitor = visitors[data.visitorId] ?: return null
        val relation = relations[data.id] ?: return null

        return info(data, visitor, relation)
    }

    private fun info(data: ReservationData): ReservationInfo? {
        val relations = relationService.getOrderByPriority(data)

        val visitor = visitorService.get(data.visitorId) ?: return null
        return info(data, visitor, relations)
    }

    private fun info(data: ReservationData, visitor: Visitor, relations: List<ReservationOfferRelation>): ReservationInfo {
        val timestamp = data.updated ?: data.created
        return ReservationInfo(data.id, visitor, relations.map { ReservationOfferReference(it.id.offerId, it.priority) }, data.status, data.comment, timestamp)
    }

}