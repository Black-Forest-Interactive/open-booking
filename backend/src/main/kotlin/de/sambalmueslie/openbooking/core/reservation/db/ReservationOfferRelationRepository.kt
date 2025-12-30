package de.sambalmueslie.openbooking.core.reservation.db

import io.micronaut.data.annotation.Repository
import io.micronaut.data.jdbc.annotation.JdbcRepository
import io.micronaut.data.model.query.builder.sql.Dialect
import io.micronaut.data.repository.CrudRepository

@Repository
@JdbcRepository(dialect = Dialect.POSTGRES)
interface ReservationOfferRelationRepository : CrudRepository<ReservationOfferRelation, ReservationOfferId> {
    fun findByIdReservationIdOrderByPriority(reservationId: Long): List<ReservationOfferRelation>
    fun deleteByIdReservationId(reservationId: Long)
}