package de.sambalmueslie.openbooking.gateway.portal.claim

import de.sambalmueslie.openbooking.core.claim.ClaimService
import de.sambalmueslie.openbooking.core.claim.api.Claim
import de.sambalmueslie.openbooking.core.claim.api.ClaimChangeRequest
import de.sambalmueslie.openbooking.error.InvalidRequestException
import io.micronaut.context.event.ApplicationEventListener
import io.micronaut.session.Session
import io.micronaut.session.event.SessionDestroyedEvent
import jakarta.inject.Singleton

@Singleton
class ClaimGateway(
    private val claimService: ClaimService,
) : ApplicationEventListener<SessionDestroyedEvent> {
    companion object {
        const val CLAIM_KEY = "CLAIM"
    }

    override fun onApplicationEvent(event: SessionDestroyedEvent) {
        val session = event.source
        val claimId = session.getClaim() ?: return
        val existing = claimService.get(claimId) ?: return
        if (existing.userId == session.id) {
            claimService.delete(claimId)
        }
    }

    fun create(session: Session, id: Long): Claim {
        val existing = claimService.get(id)
        if (existing != null && existing.userId !== session.id) throw InvalidRequestException("Claim belongs to different user")

        claimService.getByUserId(session.id).forEach { claim -> claimService.delete(claim.id) }

        val claim = claimService.create(ClaimChangeRequest(id, session.id))
        session.put(CLAIM_KEY, claim.id)
        return claim
    }

    fun delete(session: Session, id: Long) {
        val claimId = session.getClaim()
        if (claimId == null) {
            val claims = claimService.getByUserId(session.id)
            claims.forEach { claim -> claimService.delete(claim.id) }
        } else if (claimId == id) {
            claimService.delete(claimId)
            session.remove(CLAIM_KEY)
        }
    }

    fun get(session: Session): Claim? {
        val claimId = session.getClaim() ?: return null
        val existing = claimService.get(claimId)
        if (existing != null) return existing

        return claimService.create(ClaimChangeRequest(claimId, session.id))
    }

    private fun Session.getClaim(): Long? {
        return get(CLAIM_KEY).orElse(null) as? Long
    }
}