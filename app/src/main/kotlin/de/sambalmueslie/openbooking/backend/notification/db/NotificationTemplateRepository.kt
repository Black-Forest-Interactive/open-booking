package de.sambalmueslie.openbooking.backend.notification.db

import de.sambalmueslie.openbooking.backend.notification.api.NotificationTemplateType
import io.micronaut.data.annotation.Repository
import io.micronaut.data.jdbc.annotation.JdbcRepository
import io.micronaut.data.model.query.builder.sql.Dialect
import io.micronaut.data.repository.PageableRepository

@Repository
@JdbcRepository(dialect = Dialect.POSTGRES)
interface NotificationTemplateRepository : PageableRepository<NotificationTemplateData, Long> {

    fun findByTypeAndLang(type: NotificationTemplateType, lang: String): List<NotificationTemplateData>
}
