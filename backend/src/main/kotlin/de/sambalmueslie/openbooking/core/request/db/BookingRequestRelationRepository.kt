package de.sambalmueslie.openbooking.core.request.db

import io.micronaut.data.annotation.Repository
import io.micronaut.data.jdbc.annotation.JdbcRepository
import io.micronaut.data.model.query.builder.sql.Dialect
import io.micronaut.data.repository.GenericRepository

@Repository
@JdbcRepository(dialect = Dialect.POSTGRES)
@Deprecated("use reservation instead.", ReplaceWith("reservation"))
interface BookingRequestRelationRepository : GenericRepository<BookingRequestRelation, Long> {
    fun save(data: BookingRequestRelation): BookingRequestRelation
    fun saveAll(data: List<BookingRequestRelation>): List<BookingRequestRelation>

    fun getByBookingId(bookingId: Long): List<BookingRequestRelation>
    fun getByBookingRequestId(bookingRequestId: Long): List<BookingRequestRelation>

    fun getByBookingIdIn(bookingIds: Set<Long>): List<BookingRequestRelation>
    fun getByBookingRequestIdIn(bookingRequestIds: List<Long>): List<BookingRequestRelation>

    fun deleteByBookingId(bookingId: Long)
    fun deleteByBookingRequestId(bookingRequestId: Long)
    fun deleteAll()


}
