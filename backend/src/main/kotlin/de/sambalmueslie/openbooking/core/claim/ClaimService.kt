package de.sambalmueslie.openbooking.core.claim

import de.sambalmueslie.openbooking.common.BaseCrudService
import de.sambalmueslie.openbooking.common.TimeProvider
import de.sambalmueslie.openbooking.core.claim.api.Claim
import de.sambalmueslie.openbooking.core.claim.api.ClaimChangeListener
import de.sambalmueslie.openbooking.core.claim.api.ClaimChangeRequest
import de.sambalmueslie.openbooking.core.offer.OfferService
import de.sambalmueslie.openbooking.core.offer.api.Offer
import de.sambalmueslie.openbooking.error.InvalidRequestException
import de.sambalmueslie.openbooking.infrastructure.settings.SettingService
import io.micronaut.data.model.Page
import io.micronaut.data.model.Pageable
import io.micronaut.scheduling.annotation.Scheduled
import jakarta.inject.Singleton
import org.slf4j.LoggerFactory
import java.time.LocalDateTime
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.locks.ReentrantReadWriteLock
import kotlin.concurrent.read
import kotlin.concurrent.write

@Singleton
class ClaimService(
    private val offerService: OfferService,
    private val settingService: SettingService,
    private val timeProvider: TimeProvider
) : BaseCrudService<Long, Claim, ClaimChangeRequest, ClaimChangeListener>(logger) {

    companion object {
        private val logger = LoggerFactory.getLogger(ClaimService::class.java)
        private const val DEFAULT_TTL = 300L
    }

    private val claims = ConcurrentHashMap<Long, Claim>()
    private val lock = ReentrantReadWriteLock()

    @Scheduled(cron = "0/10 * * * * *")
    fun cleanupExpiredClaims() {
        val timestamp = timeProvider.now()
        val expired = lock.read {
            claims.filterValues { claim ->
                claim.expires.isBefore(timestamp)
            }
        }
        expired.values.forEach { claim -> remove(claim) }
    }

    override fun get(id: Long): Claim? {
        return claims[id]
    }

    fun getByIds(ids: Set<Long>): List<Claim> {
        return ids.mapNotNull { claims[it] }
    }

    fun getByUserId(userId: String): List<Claim> {
        return lock.read {
            claims.values.filter { it.userId == userId }
        }
    }

    override fun getAll(pageable: Pageable): Page<Claim> {
        TODO("Not yet implemented")
    }

    override fun create(request: ClaimChangeRequest): Claim {
        val offer = offerService.get(request.offerId)
            ?: throw InvalidRequestException("Cannot find offer ${request.offerId} to claim")

        return lock.write {
            val existing = claims[offer.id]
            when {
                existing == null -> add(offer, request.userId)
                existing.userId == request.userId -> existing
                else -> throw InvalidRequestException("Cannot create claim on already claimed offer")
            }
        }
    }

    override fun update(id: Long, request: ClaimChangeRequest): Claim {
        TODO("Not yet implemented")
    }

    override fun delete(id: Long): Claim? {
        val existing = claims[id] ?: return null
        return remove(existing)
    }

    private fun add(offer: Offer, userId: String): Claim {
        val timestamp = timeProvider.now()
        val expires = getExpires(timestamp)
        val claim = Claim(offer.id, userId, expires, timestamp, null)
        claims[offer.id] = claim
        logger.debug("Claim {} added", claim)
        notifyCreated(claim, ClaimChangeRequest(offer.id, userId))
        return claim
    }

    private fun remove(claim: Claim): Claim {
        lock.write {
            claims.remove(claim.id)
        }
        logger.debug("Claim {} removed", claim)
        notifyDeleted(claim)
        return claim
    }

    private fun getExpires(timestamp: LocalDateTime): LocalDateTime {
        return timestamp.plusSeconds(settingService.getClaimTTL().value ?: DEFAULT_TTL)
    }

}