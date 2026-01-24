package de.sambalmueslie.openbooking.core.offer.assembler

import de.sambalmueslie.openbooking.common.findByIdOrNull
import de.sambalmueslie.openbooking.core.booking.BookingService
import de.sambalmueslie.openbooking.core.booking.api.Booking
import de.sambalmueslie.openbooking.core.booking.api.BookingStatus
import de.sambalmueslie.openbooking.core.offer.api.Assignment
import de.sambalmueslie.openbooking.core.offer.api.OfferReference
import de.sambalmueslie.openbooking.core.offer.db.OfferData
import de.sambalmueslie.openbooking.core.offer.db.OfferRepository
import io.micronaut.data.model.Page
import io.micronaut.data.model.Pageable
import jakarta.inject.Singleton

@Singleton
class OfferReferenceAssembler(
    private val repository: OfferRepository,
    private val bookingService: BookingService,
) {

    fun getAll(pageable: Pageable): Page<OfferReference> {
        return pageToReferences { repository.findAllOrderByStart(pageable) }
    }

    fun get(id: Long): OfferReference? {
        return dataToReference { repository.findByIdOrNull(id) }
    }

    fun getByIds(ids: Set<Long>): List<OfferReference> {
        return listToReferences { repository.findByIdIn(ids) }
    }

    private fun pageToReferences(provider: () -> Page<OfferData>): Page<OfferReference> {
        return references(provider.invoke())
    }

    private fun listToReferences(provider: () -> List<OfferData>): List<OfferReference> {
        return references(provider.invoke())
    }

    private fun dataToReference(provider: () -> OfferData?): OfferReference? {
        val data = provider.invoke() ?: return null
        return references(data)
    }

    private fun references(data: Page<OfferData>): Page<OfferReference> {
        val result = references(data.content)
        return Page.of(result, data.pageable, data.totalSize)
    }

    private fun references(data: List<OfferData>): List<OfferReference> {
        val offerIds = data.map { it.id }.toSet()
        val bookings = bookingService.getByOfferIds(offerIds).groupBy { it.offerId }
        return data.map { references(it, bookings[it.id] ?: emptyList()) }
    }

    private fun references(data: OfferData): OfferReference {
        val bookings = bookingService.getByOfferId(data.id)
        return references(data, bookings)
    }

    private fun references(data: OfferData, bookings: List<Booking>): OfferReference {
        val confirmedSpace = bookings.filter { it.status == BookingStatus.CONFIRMED }.sumOf { it.size }
        val pendingSpace = bookings.filter { it.status == BookingStatus.PENDING }.sumOf { it.size }
        val availableSpace = 0.coerceAtLeast(data.maxPersons - confirmedSpace - pendingSpace)
        val disabledSpace = if (data.active) 0 else data.maxPersons

        val assignment = Assignment(confirmedSpace, pendingSpace, availableSpace, disabledSpace)
        return OfferReference(data.convert(), assignment)
    }

}