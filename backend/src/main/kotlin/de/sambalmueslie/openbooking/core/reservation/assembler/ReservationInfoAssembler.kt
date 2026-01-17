package de.sambalmueslie.openbooking.core.reservation.assembler

import de.sambalmueslie.openbooking.common.findByIdOrNull
import de.sambalmueslie.openbooking.core.offer.api.OfferInfo
import de.sambalmueslie.openbooking.core.offer.assembler.OfferInfoAssembler
import de.sambalmueslie.openbooking.core.reservation.api.ReservationInfo
import de.sambalmueslie.openbooking.core.reservation.db.ReservationData
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
    private val offerInfoAssembler: OfferInfoAssembler,
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
        return listToInfo { repository.findByOfferId(offerId) }
    }

    fun getByOfferIds(offerIds: Set<Long>): List<ReservationInfo> {
        return listToInfo { repository.findByOfferIdIn(offerIds) }
    }

    fun getByKey(key: String): ReservationInfo? {
        return dataToInfo { repository.findByKey(key) }
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


    private fun info(data: Page<ReservationData>): Page<ReservationInfo> {
        val result = info(data.content)
        return Page.of(result, data.pageable, data.totalSize)
    }

    private fun info(data: List<ReservationData>): List<ReservationInfo> {
        val visitorIds = data.map { it.visitorId }.toSet()
        val visitors = visitorService.getVisitors(visitorIds).associateBy { it.id }

        val offerIds = data.map { it.offerId }.toSet()
        val offers = offerInfoAssembler.getByIds(offerIds).associateBy { it.offer.id }

        return data.mapNotNull { info(it, visitors, offers) }.sortedBy { it.visitor.verification.status.order }
    }

    private fun info(data: ReservationData, visitors: Map<Long, Visitor>, offers: Map<Long, OfferInfo>): ReservationInfo? {
        val visitor = visitors[data.visitorId] ?: return null
        val offer = offers[data.offerId] ?: return null
        return info(data, visitor, offer)
    }

    private fun info(data: ReservationData): ReservationInfo? {
        val visitor = visitorService.get(data.visitorId) ?: return null
        val offer = offerInfoAssembler.get(data.offerId) ?: return null
        return info(data, visitor, offer)
    }

    private fun info(data: ReservationData, visitor: Visitor, offer: OfferInfo): ReservationInfo {
        val timestamp = data.updated ?: data.created
        return ReservationInfo(data.id, visitor, offer, data.status, data.comment, timestamp)
    }

}