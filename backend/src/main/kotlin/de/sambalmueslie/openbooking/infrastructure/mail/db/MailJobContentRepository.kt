package de.sambalmueslie.openbooking.infrastructure.mail.db

import io.micronaut.data.annotation.Repository
import io.micronaut.data.jdbc.annotation.JdbcRepository
import io.micronaut.data.model.query.builder.sql.Dialect
import io.micronaut.data.repository.PageableRepository


@Repository
@JdbcRepository(dialect = Dialect.POSTGRES)
interface MailJobContentRepository : PageableRepository<de.sambalmueslie.openbooking.infrastructure.mail.db.MailJobContentData, Long> {
    fun findByJobId(jobId: Long): de.sambalmueslie.openbooking.infrastructure.mail.db.MailJobContentData?
}
