package de.sambalmueslie.openbooking.core.request


import de.sambalmueslie.openbooking.core.group.api.VisitorGroupStatus
import de.sambalmueslie.openbooking.core.request.api.BookingRequestFilterRequest
import de.sambalmueslie.openbooking.core.request.api.BookingRequestStatus
import de.sambalmueslie.openbooking.core.request.db.BookingRequestData
import de.sambalmueslie.openbooking.core.request.db.BookingRequestRepository
import io.micronaut.data.model.Page
import io.micronaut.data.model.Pageable
import jakarta.inject.Singleton
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import java.time.LocalDate

@Singleton
class BookingRequestFilterService(
    private val repository: BookingRequestRepository,
) {

    companion object {
        private val logger: Logger = LoggerFactory.getLogger(BookingRequestFilterService::class.java)
    }

    fun filterInfoUnconfirmed(filter: BookingRequestFilterRequest, pageable: Pageable): Page<BookingRequestData> {
        val offerDate: LocalDate? = filter.offerDate
        val visitorGroupStatus: VisitorGroupStatus? = filter.visitorGroupStatus
        val query: String? = filter.query?.let { "%$it%" }
        val status = listOf(BookingRequestStatus.UNKNOWN, BookingRequestStatus.UNCONFIRMED)

        val data = if (offerDate != null && visitorGroupStatus == null && query.isNullOrBlank()) {
            repository.findByOfferDate(offerDate, status, pageable)
        } else if (offerDate == null && visitorGroupStatus != null && query.isNullOrBlank()) {
            repository.findByVisitorGroupStatus(visitorGroupStatus, status, pageable)
        } else if (offerDate == null && visitorGroupStatus == null && !query.isNullOrBlank()) {
            repository.findByQuery(query, status, pageable)
        } else if (offerDate != null && visitorGroupStatus != null && query.isNullOrBlank()) {
            repository.findByOfferDateAndVisitorGroupStatus(offerDate, visitorGroupStatus, status, pageable)
        } else if (offerDate != null && visitorGroupStatus == null && !query.isNullOrBlank()) {
            repository.findByOfferDateAndQuery(offerDate, query, status, pageable)
        } else if (offerDate == null && visitorGroupStatus != null && !query.isNullOrBlank()) {
            repository.findByVisitorGroupStatusAndQuery(visitorGroupStatus, query, status, pageable)
        } else if (offerDate != null && visitorGroupStatus != null && !query.isNullOrBlank()) {
            repository.findByOfferDateAndVisitorGroupStatusAndQuery(offerDate, visitorGroupStatus, query, status, pageable)
        } else {
            getUnconfirmedData(pageable)
        }
        return data
    }

    fun getUnconfirmedData(pageable: Pageable) = repository.findByStatusIn(listOf(BookingRequestStatus.UNKNOWN, BookingRequestStatus.UNCONFIRMED), pageable)
}
