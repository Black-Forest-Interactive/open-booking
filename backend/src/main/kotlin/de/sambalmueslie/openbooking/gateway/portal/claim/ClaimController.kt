package de.sambalmueslie.openbooking.gateway.portal.claim

import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Delete
import io.micronaut.http.annotation.Get
import io.micronaut.http.annotation.Post
import io.micronaut.security.annotation.Secured
import io.micronaut.security.rules.SecurityRule
import io.micronaut.session.Session
import io.swagger.v3.oas.annotations.tags.Tag

@Controller("/api/portal/claim")
@Tag(name = "Reservation API")
@Secured(SecurityRule.IS_ANONYMOUS)
class ClaimController(private val gateway: ClaimGateway) {

    @Post("{id}")
    fun create(session: Session, id: Long) = gateway.create(session, id)

    @Delete("{id}")
    fun delete(session: Session, id: Long) = gateway.delete(session, id)

    @Get()
    fun get(session: Session) = gateway.get(session)

}