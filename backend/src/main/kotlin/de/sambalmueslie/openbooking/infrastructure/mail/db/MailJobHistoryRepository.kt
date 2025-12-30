package de.sambalmueslie.openbooking.infrastructure.mail.db

import io.micronaut.data.annotation.Repository
import io.micronaut.data.jdbc.annotation.JdbcRepository
import io.micronaut.data.model.Page
import io.micronaut.data.model.Pageable
import io.micronaut.data.model.query.builder.sql.Dialect
import io.micronaut.data.repository.PageableRepository


@Repository
@JdbcRepository(dialect = Dialect.POSTGRES)
interface MailJobHistoryRepository : PageableRepository<de.sambalmueslie.openbooking.infrastructure.mail.db.MailJobHistoryEntryData, Long> {

    fun findByJobIdOrderByTimestampDesc(jobId: Long, pageable: Pageable): Page<de.sambalmueslie.openbooking.infrastructure.mail.db.MailJobHistoryEntryData>
}
