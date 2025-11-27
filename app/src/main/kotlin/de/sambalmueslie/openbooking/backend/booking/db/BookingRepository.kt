package de.sambalmueslie.openbooking.backend.booking.db

import de.sambalmueslie.openbooking.backend.booking.api.BookingStatus
import io.micronaut.data.annotation.Query
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

    fun countByVisitorGroupId(visitorGroupId: Long): Long
    fun findByIdIn(bookingIds: Set<Long>): List<BookingData>

    fun findByVisitorGroupId(visitorGroupId: Long, pageable: Pageable): Page<BookingData>

    @Query(
        value = "SELECT b.* FROM booking b INNER JOIN visitor_group v ON b.visitor_group_id = v.id WHERE (v.title ILIKE :query) OR (v.contact ILIKE  :query) ORDER BY b.created",
        countQuery = "SELECT COUNT(*) FROM booking b INNER JOIN visitor_group v ON b.visitor_group_id = v.id WHERE (v.title ILIKE :query) OR (v.contact ILIKE  :query)",
        nativeQuery = true
    )
    fun search(query: String, pageable: Pageable): Page<BookingData>

}
