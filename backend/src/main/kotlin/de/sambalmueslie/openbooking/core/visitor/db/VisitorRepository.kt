package de.sambalmueslie.openbooking.core.visitor.db

import io.micronaut.data.annotation.Repository
import io.micronaut.data.jdbc.annotation.JdbcRepository
import io.micronaut.data.model.query.builder.sql.Dialect
import io.micronaut.data.repository.PageableRepository

@Repository
@JdbcRepository(dialect = Dialect.POSTGRES)
interface VisitorRepository : PageableRepository<VisitorData, Long> {
    fun findByIdIn(ids: Set<Long>): List<VisitorData>
}
