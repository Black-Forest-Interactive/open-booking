package de.sambalmueslie.openbooking.core.offer.assembler

import de.sambalmueslie.openbooking.common.findByIdOrNull
import de.sambalmueslie.openbooking.core.booking.api.BookingDetails
import de.sambalmueslie.openbooking.core.booking.api.BookingStatus
import de.sambalmueslie.openbooking.core.booking.assembler.BookingDetailsAssembler
import de.sambalmueslie.openbooking.core.offer.api.Assignment
import de.sambalmueslie.openbooking.core.offer.api.OfferDetails
import de.sambalmueslie.openbooking.core.offer.db.OfferData
import de.sambalmueslie.openbooking.core.offer.db.OfferRepository
import io.micronaut.data.model.Page
import io.micronaut.data.model.Pageable
import jakarta.inject.Singleton
import org.slf4j.LoggerFactory
import java.time.LocalDate

@Singleton
class OfferDetailsAssembler(
    private val repository: OfferRepository,
    private val bookingAssembler: BookingDetailsAssembler,
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
        val bookings = bookingAssembler.getByOfferIds(offerIds).groupBy { it.booking.offerId }
        return data.map { details(it, bookings[it.id] ?: emptyList()) }
    }

    private fun details(data: OfferData): OfferDetails {
        val bookings = bookingAssembler.getByOfferId(data.id)
        return details(data, bookings)
    }

    private fun details(data: OfferData, bookings: List<BookingDetails>): OfferDetails {
        val bookedSpace = bookings.filter { it.booking.status == BookingStatus.CONFIRMED }.sumOf { it.visitor.size }
        val reservedSpace = bookings.filter { it.booking.status == BookingStatus.PENDING }.sumOf { it.visitor.size }
        val availableSpace = 0.coerceAtLeast(data.maxPersons - bookedSpace - reservedSpace)
        val disabledSpace = if (data.active) 0 else data.maxPersons

        val assignment = Assignment(bookedSpace, reservedSpace, availableSpace, disabledSpace)
        val timestamp = data.updated ?: data.created
        return OfferDetails(data.convert(), assignment, bookings, timestamp)
    }

    private fun getDataByDate(date: LocalDate): List<OfferData> {
        val start = date.atStartOfDay()
        val finish = date.atTime(23, 59, 59)
        return repository.findByStartGreaterThanEqualsAndFinishLessThanEqualsOrderByStart(start, finish)
    }
}