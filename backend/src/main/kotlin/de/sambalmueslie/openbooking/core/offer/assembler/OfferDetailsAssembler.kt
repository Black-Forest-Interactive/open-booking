package de.sambalmueslie.openbooking.core.offer.assembler

import de.sambalmueslie.openbooking.common.findByIdOrNull
import de.sambalmueslie.openbooking.core.booking.api.BookingDetails
import de.sambalmueslie.openbooking.core.booking.api.BookingStatus
import de.sambalmueslie.openbooking.core.booking.assembler.BookingDetailsAssembler
import de.sambalmueslie.openbooking.core.offer.api.Assignment
import de.sambalmueslie.openbooking.core.offer.api.OfferDetails
import de.sambalmueslie.openbooking.core.offer.db.OfferData
import de.sambalmueslie.openbooking.core.offer.db.OfferRepository
import de.sambalmueslie.openbooking.core.reservation.api.ReservationInfo
import de.sambalmueslie.openbooking.core.reservation.api.ReservationStatus
import de.sambalmueslie.openbooking.core.reservation.assembler.ReservationInfoAssembler
import io.micronaut.data.model.Page
import io.micronaut.data.model.Pageable
import jakarta.inject.Singleton
import org.slf4j.LoggerFactory
import java.time.LocalDate

@Singleton
class OfferDetailsAssembler(
    private val repository: OfferRepository,
    private val bookingAssembler: BookingDetailsAssembler,
    private val reservationAssembler: ReservationInfoAssembler,
) {
    companion object {
        private val logger = LoggerFactory.getLogger(OfferDetailsAssembler::class.java)
    }

    fun getAll(pageable: Pageable): Page<OfferDetails> {
        return pageToDetails { repository.findAllOrderByStart(pageable) }
    }

    fun get(id: Long): OfferDetails? {
        return dataToDetails { repository.findByIdOrNull(id) }
    }

    fun getByIds(ids: Set<Long>): List<OfferDetails> {
        return listToDetails { repository.findByIdIn(ids) }
    }

    fun getByDate(date: LocalDate): List<OfferDetails> {
        return listToDetails { getDataByDate(date) }
    }

    private fun pageToDetails(provider: () -> Page<OfferData>): Page<OfferDetails> {
        return details(provider.invoke())
    }

    private fun listToDetails(provider: () -> List<OfferData>): List<OfferDetails> {
        return details(provider.invoke())
    }

    private fun dataToDetails(provider: () -> OfferData?): OfferDetails? {
        val data = provider.invoke() ?: return null
        return details(data)
    }

    private fun details(data: Page<OfferData>): Page<OfferDetails> {
        val result = details(data.content)
        return Page.of(result, data.pageable, data.totalSize)
    }

    private fun details(data: List<OfferData>): List<OfferDetails> {
        val offerIds = data.map { it.id }.toSet()
        val bookings = bookingAssembler.getDetailByOfferIds(offerIds).groupBy { it.booking.offerId }
        val reservations = reservationAssembler.getByOfferIds(offerIds)
            .flatMap { infos -> infos.offer.map { offer -> offer.offerId to infos } }
            .groupBy({ it.first }, { it.second })
        return data.map { details(it, bookings[it.id] ?: emptyList(), reservations[it.id] ?: emptyList()) }
    }

    private fun details(data: OfferData, bookings: Map<Long, List<BookingDetails>>, reservations: Map<Long, List<ReservationInfo>>): OfferDetails? {
        val bookings = bookings[data.id] ?: return null
        val reservations = reservations[data.id] ?: return null

        return details(data, bookings, reservations)
    }

    private fun details(data: OfferData): OfferDetails {
        val bookings = bookingAssembler.getDetailByOfferId(data.id)
        val reservations = reservationAssembler.getByOfferId(data.id)
        return details(data, bookings, reservations)
    }

    private fun details(data: OfferData, bookings: List<BookingDetails>, reservations: List<ReservationInfo>): OfferDetails {
        val bookedSpace = bookings.filter { it.booking.status == BookingStatus.CONFIRMED }.sumOf { it.booking.size }
        val reservedSpace = reservations.filter { it.status == ReservationStatus.UNCONFIRMED }.sumOf { it.visitor.size }
        val availableSpace = 0.coerceAtLeast(data.maxPersons - bookedSpace - reservedSpace)

        val assignment = Assignment(bookedSpace, reservedSpace, availableSpace)
        val timestamp = data.updated ?: data.created
        return OfferDetails(data.convert(), assignment, bookings, reservations, timestamp)
    }

    private fun getDataByDate(date: LocalDate): List<OfferData> {
        val start = date.atStartOfDay()
        val finish = date.atTime(23, 59, 59)
        return repository.findByStartGreaterThanEqualsAndFinishLessThanEqualsOrderByStart(start, finish)
    }
}