package de.sambalmueslie.openbooking.frontend.admin


import de.sambalmueslie.openbooking.core.offer.OfferService
import de.sambalmueslie.openbooking.core.offer.api.OfferChangeRequest
import de.sambalmueslie.openbooking.error.InvalidRequestException
import de.sambalmueslie.openbooking.frontend.admin.api.OfferSetupRequest
import jakarta.inject.Singleton
import org.slf4j.LoggerFactory
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.temporal.ChronoUnit
import kotlin.math.ceil


@Singleton
class AdminService(
    private val offerService: OfferService
) {

    companion object {
        private val logger = LoggerFactory.getLogger(AdminService::class.java)
    }

    fun setup(request: OfferSetupRequest) {
        offerService.deleteAll() // TODO instead of cleanup and modify existing offers

        val days: Long = ChronoUnit.DAYS.between(request.startDate, request.finishDate);
        if (days <= 0) throw InvalidRequestException("Start Date ${request.startDate} cannot be before ${request.finishDate} and not at the same day")

        for (offset in 0..days) {
            val day = request.startDate.plusDays(offset)
            setupOfferForDay(request, day)
        }
    }

    private fun setupOfferForDay(request: OfferSetupRequest, day: LocalDate) {
        val minutes = ChronoUnit.MINUTES.between(request.startTime, request.finishTime)
        val offerMinutes = request.duration.toMinutes()
        if (minutes <= offerMinutes) throw InvalidRequestException("Start Time ${request.startTime} cannot be before ${request.finishTime} and and must be greater than ${request.duration}")

        val offers = ceil(minutes.toDouble() / offerMinutes).toInt()
        for (offset in 0 until offers) {
            val time = request.startTime.plusMinutes(offset * offerMinutes)
            val start = LocalDateTime.of(day, time)
            val finish = start.plusMinutes(offerMinutes)
            offerService.create(OfferChangeRequest(start, finish, request.maxPersons, true))
        }
    }


}
