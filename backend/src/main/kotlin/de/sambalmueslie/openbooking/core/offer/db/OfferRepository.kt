package de.sambalmueslie.openbooking.core.offer.db

import io.micronaut.data.annotation.Repository
import io.micronaut.data.jdbc.annotation.JdbcRepository
import io.micronaut.data.model.Page
import io.micronaut.data.model.Pageable
import io.micronaut.data.model.query.builder.sql.Dialect
import io.micronaut.data.repository.PageableRepository
import io.micronaut.data.repository.jpa.JpaSpecificationExecutor
import java.time.LocalDateTime

@Repository
@JdbcRepository(dialect = Dialect.POSTGRES)
interface OfferRepository : PageableRepository<OfferData, Long>, JpaSpecificationExecutor<OfferData> {

    fun findByStartGreaterThanEqualsAndFinishLessThanEqualsOrderByStart(start: LocalDateTime, end: LocalDateTime): List<OfferData>
    fun findOneByStartGreaterThanEqualsOrderByStart(start: LocalDateTime): OfferData?
    fun findOneByStartGreaterThanEqualsOrderByStartDesc(start: LocalDateTime): OfferData?
    fun findOneByStartLessThanEqualsOrderByStartDesc(start: LocalDateTime): OfferData?
    fun findByIdIn(offerIds: Set<Long>): List<OfferData>
    fun findOneByStart(start: LocalDateTime): OfferData?
    fun findAllOrderByStart(pageable: Pageable): Page<OfferData>

    fun findAllByActiveOrderByStart(active: Boolean, pageable: Pageable): Page<OfferData>

    fun findAllByStartGreaterThanEqualsAndFinishLessThanOrderByStart(from: LocalDateTime, to: LocalDateTime, pageable: Pageable): Page<OfferData>
    fun findAllByStartGreaterThanEqualsAndFinishLessThanOrderByStart(from: LocalDateTime, to: LocalDateTime): List<OfferData>
    fun findOneOrderByStart(): OfferData?
    fun findOneOrderByStartDesc(): OfferData?


}
