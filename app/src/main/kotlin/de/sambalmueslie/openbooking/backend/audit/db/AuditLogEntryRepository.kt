package de.sambalmueslie.openbooking.backend.audit.db

import io.micronaut.data.annotation.Repository
import io.micronaut.data.jdbc.annotation.JdbcRepository
import io.micronaut.data.model.Page
import io.micronaut.data.model.Pageable
import io.micronaut.data.model.query.builder.sql.Dialect
import io.micronaut.data.repository.PageableRepository

@Repository
@JdbcRepository(dialect = Dialect.POSTGRES)
interface AuditLogEntryRepository : PageableRepository<AuditLogEntryData, Long> {

    fun findAllOrderByTimestampDesc(pageable: Pageable): Page<AuditLogEntryData>

    fun findAllByReferenceId(referenceId: String, pageable: Pageable): Page<AuditLogEntryData>
}
