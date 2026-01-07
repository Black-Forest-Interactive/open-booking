package de.sambalmueslie.openbooking.core.reservation.db

import io.micronaut.data.annotation.Repository
import io.micronaut.data.jdbc.annotation.JdbcRepository
import io.micronaut.data.model.query.builder.sql.Dialect
import io.micronaut.data.repository.PageableRepository

@Repository
@JdbcRepository(dialect = Dialect.POSTGRES)
interface ReservationRepository : PageableRepository<ReservationData, Long> {
    fun findByIdIn(ids: Set<Long>): List<ReservationData>
    fun findByKey(key: String): ReservationData?

    fun findByOfferId(offerId: Long): List<ReservationData>
    fun findByOfferIdIn(offerIds: Set<Long>): List<ReservationData>

    fun findByVisitorId(visitorId: Long): List<ReservationData>
    fun findByVisitorIdIn(visitorIds: Set<Long>): List<ReservationData>
}
