package de.sambalmueslie.openbooking.backend.response.db

import de.sambalmueslie.openbooking.backend.response.api.ResponseType
import io.micronaut.data.annotation.Repository
import io.micronaut.data.jdbc.annotation.JdbcRepository
import io.micronaut.data.model.query.builder.sql.Dialect
import io.micronaut.data.repository.PageableRepository

@Repository
@JdbcRepository(dialect = Dialect.POSTGRES)
interface ResponseRepository : PageableRepository<ResponseData, Long> {

    fun findOneByLangAndType(lang: String, type: ResponseType): ResponseData?
    fun findOneByType(type: ResponseType): ResponseData?
}
