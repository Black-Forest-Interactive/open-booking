package de.sambalmueslie.openbooking.core.reservation

import de.sambalmueslie.openbooking.core.offer.assembler.OfferDetailsAssembler
import de.sambalmueslie.openbooking.core.reservation.db.ReservationOfferRelationRepository
import de.sambalmueslie.openbooking.core.reservation.db.ReservationRepository
import de.sambalmueslie.openbooking.core.visitor.VisitorService
import jakarta.inject.Singleton
import org.slf4j.LoggerFactory

@Singleton
class ReservationConverter(
    private val offerService: OfferDetailsAssembler,
    private val visitorService: VisitorService,
    private val repository: ReservationRepository,
    private val relationRepository: ReservationOfferRelationRepository,
) {
    companion object {
        private val logger = LoggerFactory.getLogger(ReservationConverter::class.java)
    }


}

