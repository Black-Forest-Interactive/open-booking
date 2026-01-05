package de.sambalmueslie.openbooking.core.request


import de.sambalmueslie.openbooking.core.request.api.BookingRequestFilterRequest
import de.sambalmueslie.openbooking.core.request.api.BookingRequestStatus
import de.sambalmueslie.openbooking.core.request.db.BookingRequestData
import de.sambalmueslie.openbooking.core.request.db.BookingRequestRepository
import de.sambalmueslie.openbooking.core.visitor.api.VerificationStatus
import io.micronaut.data.model.Page
import io.micronaut.data.model.Pageable
import jakarta.inject.Singleton
import org.slf4j.LoggerFactory
import java.time.LocalDate

@Singleton
@Deprecated("use reservation instead.", ReplaceWith("reservation"))
class BookingRequestFilterService(
    private val repository: BookingRequestRepository,
) {

    companion object {
        private val logger = LoggerFactory.getLogger(BookingRequestFilterService::class.java)
    }

    fun filterInfoUnconfirmed(filter: BookingRequestFilterRequest, pageable: Pageable): Page<BookingRequestData> {
        val offerDate: LocalDate? = filter.offerDate
        val visitorStatus: VerificationStatus? = filter.visitorStatus
        val query: String? = filter.query?.let { "%$it%" }
        val status = listOf(BookingRequestStatus.UNKNOWN, BookingRequestStatus.UNCONFIRMED)

        val data = if (offerDate != null && visitorStatus == null && query.isNullOrBlank()) {
            repository.findByOfferDate(offerDate, status, pageable)
        } else if (offerDate == null && visitorStatus != null && query.isNullOrBlank()) {
            repository.findByVisitorStatus(visitorStatus, status, pageable)
        } else if (offerDate == null && visitorStatus == null && !query.isNullOrBlank()) {
            repository.findByQuery(query, status, pageable)
        } else if (offerDate != null && visitorStatus != null && query.isNullOrBlank()) {
            repository.findByOfferDateAndVisitorStatus(offerDate, visitorStatus, status, pageable)
        } else if (offerDate != null && visitorStatus == null && !query.isNullOrBlank()) {
            repository.findByOfferDateAndQuery(offerDate, query, status, pageable)
        } else if (offerDate == null && visitorStatus != null && !query.isNullOrBlank()) {
            repository.findByVisitorStatusAndQuery(visitorStatus, query, status, pageable)
        } else if (offerDate != null && visitorStatus != null && !query.isNullOrBlank()) {
            repository.findByOfferDateAndVisitorStatusAndQuery(offerDate, visitorStatus, query, status, pageable)
        } else {
            getUnconfirmedData(pageable)
        }
        return data
    }

    fun getUnconfirmedData(pageable: Pageable) = repository.findByStatusIn(listOf(BookingRequestStatus.UNKNOWN, BookingRequestStatus.UNCONFIRMED), pageable)
}
