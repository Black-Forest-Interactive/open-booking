package de.sambalmueslie.openbooking.infrastructure.mail.db

import io.micronaut.data.annotation.Repository
import io.micronaut.data.jdbc.annotation.JdbcRepository
import io.micronaut.data.model.Page
import io.micronaut.data.model.Pageable
import io.micronaut.data.model.query.builder.sql.Dialect
import io.micronaut.data.repository.PageableRepository


@Repository
@JdbcRepository(dialect = Dialect.POSTGRES)
interface MailJobRepository : PageableRepository<de.sambalmueslie.openbooking.infrastructure.mail.db.MailJobData, Long> {

    fun findAllOrderByUpdatedDesc(pageable: Pageable): Page<de.sambalmueslie.openbooking.infrastructure.mail.db.MailJobData>
    fun findAllByStatus(status: de.sambalmueslie.openbooking.infrastructure.mail.api.MailJobStatus, pageable: Pageable): Page<de.sambalmueslie.openbooking.infrastructure.mail.db.MailJobData>

}
