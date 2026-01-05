package de.sambalmueslie.openbooking.core.booking.db

import de.sambalmueslie.openbooking.core.booking.api.BookingStatus
import io.micronaut.data.annotation.Repository
import io.micronaut.data.jdbc.annotation.JdbcRepository
import io.micronaut.data.model.Page
import io.micronaut.data.model.Pageable
import io.micronaut.data.model.query.builder.sql.Dialect
import io.micronaut.data.repository.PageableRepository

@Repository
@JdbcRepository(dialect = Dialect.POSTGRES)
interface BookingRepository : PageableRepository<BookingData, Long> {

    fun findByOfferIdIn(offerIds: Set<Long>): List<BookingData>
    fun findByOfferId(offerId: Long): List<BookingData>
    fun findByOfferId(offerId: Long, pageable: Pageable): Page<BookingData>
    fun findByOfferIdAndStatus(offerId: Long, status: BookingStatus): List<BookingData>
    fun findByOfferIdInAndStatus(offerIds: Set<Long>, status: BookingStatus): List<BookingData>

    fun countByVisitorId(visitorId: Long): Long
    fun findByIdIn(bookingIds: Set<Long>): List<BookingData>

    fun findByVisitorId(visitorId: Long, pageable: Pageable): Page<BookingData>


}
