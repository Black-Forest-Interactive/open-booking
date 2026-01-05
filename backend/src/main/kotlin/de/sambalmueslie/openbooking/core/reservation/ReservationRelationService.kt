package de.sambalmueslie.openbooking.core.reservation

import de.sambalmueslie.openbooking.core.offer.api.Offer
import de.sambalmueslie.openbooking.core.reservation.api.ReservationChangeRequest
import de.sambalmueslie.openbooking.core.reservation.db.ReservationData
import de.sambalmueslie.openbooking.core.reservation.db.ReservationOfferRelation
import de.sambalmueslie.openbooking.core.reservation.db.ReservationOfferRelationRepository
import jakarta.inject.Singleton

@Singleton
class ReservationRelationService(
    private val relationRepository: ReservationOfferRelationRepository,
) {

    fun getIdsByOfferId(offerId: Long): Set<Long> {
        val relations = relationRepository.findByIdOfferId(offerId)
        return relations.map { it.id.reservationId }.toSet()
    }

    fun getIdsByOfferIds(offerIds: Set<Long>): Set<Long> {
        val relations = relationRepository.findByIdOfferIdIn(offerIds)
        return relations.map { it.id.reservationId }.toSet()
    }

    fun get(data: List<ReservationData>): Map<Long, List<ReservationOfferRelation>> {
        val reservationIds = data.map { it.id }
        return relationRepository.findByIdReservationIdIn(reservationIds).groupBy { it.id.reservationId }
    }

    fun getOrderByPriority(data: ReservationData): List<ReservationOfferRelation> {
        return relationRepository.findByIdReservationIdOrderByPriority(data.id)
    }

    fun create(data: ReservationData, request: ReservationChangeRequest, offers: List<Offer>) {
        val relations = offers.sortedBy { request.offerIds.indexOf(it.id) }
            .mapIndexed { index, offer -> ReservationOfferRelation.create(data, offer.id, index) }
        relationRepository.saveAll(relations)
    }

    fun update(data: ReservationData, request: ReservationChangeRequest, offers: List<Offer>) {
        relationRepository.deleteByIdReservationId(data.id)

        val relations = offers.sortedBy { request.offerIds.indexOf(it.id) }.mapIndexed { index, offer -> ReservationOfferRelation.create(data, offer.id, index) }
        relationRepository.saveAll(relations)
    }

    fun delete(data: ReservationData) {
        relationRepository.deleteByIdReservationId(data.id)
    }

}