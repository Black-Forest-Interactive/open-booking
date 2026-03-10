package de.sambalmueslie.openbooking.core.offer.assembler

import de.sambalmueslie.openbooking.common.findByIdOrNull
import de.sambalmueslie.openbooking.core.booking.api.BookingDetails
import de.sambalmueslie.openbooking.core.booking.assembler.BookingDetailsAssembler
import de.sambalmueslie.openbooking.core.guide.GuideService
import de.sambalmueslie.openbooking.core.guide.api.Guide
import de.sambalmueslie.openbooking.core.label.LabelService
import de.sambalmueslie.openbooking.core.label.api.Label
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
    private val labelService: LabelService,
    private val guideService: GuideService,
    private val bookingAssembler: BookingDetailsAssembler,
    private val assignmentProvider: AssignmentProvider
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
        val labelIds = data.mapNotNull { it.labelId }.toSet()
        val labels = labelService.getByIds(labelIds).associateBy { it.id }

        val guideIds = data.mapNotNull { it.guideId }.toSet()
        val guides = guideService.getByIds(guideIds).associateBy { it.id }

        val offerIds = data.map { it.id }.toSet()
        val bookings = bookingAssembler.getByOfferIds(offerIds).groupBy { it.booking.offerId }

        return data.map { details(it, labels, guides, bookings) }
    }

    private fun details(data: OfferData, labels: Map<Long, Label>, guides: Map<Long, Guide>, bookings: Map<Long, List<BookingDetails>>): OfferDetails {
        val label = labels[data.labelId]
        val guide = guides[data.guideId]
        val booking = bookings[data.id] ?: emptyList()

        return details(data, label, guide, booking)
    }


    private fun details(data: OfferData): OfferDetails {
        val label = data.labelId?.let { labelService.get(it) }
        val guide = data.guideId?.let { guideService.get(it) }
        val bookings = bookingAssembler.getByOfferId(data.id)
        return details(data, label, guide, bookings)
    }

    private fun details(data: OfferData, label: Label?, guide: Guide?, bookings: List<BookingDetails>): OfferDetails {
        val assignment = assignmentProvider.getBookingDetailsAssignment(data, bookings)
        val timestamp = data.updated ?: data.created
        return OfferDetails(data.convert(), label, guide, assignment, bookings, timestamp)
    }

    private fun getDataByDate(date: LocalDate): List<OfferData> {
        val start = date.atStartOfDay()
        val finish = date.atTime(23, 59, 59)
        return repository.findByStartGreaterThanEqualsAndFinishLessThanEqualsOrderByStart(start, finish)
    }
}