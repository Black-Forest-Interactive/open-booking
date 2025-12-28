package de.sambalmueslie.openbooking.core.offer.db

import de.sambalmueslie.openbooking.common.DataObject
import de.sambalmueslie.openbooking.core.offer.api.Offer
import de.sambalmueslie.openbooking.core.offer.api.OfferChangeRequest
import jakarta.persistence.*
import java.time.LocalDateTime


@Entity(name = "Offer")
@Table(name = "offer")
data class OfferData(
    @Id @GeneratedValue(strategy = GenerationType.SEQUENCE) var id: Long,
    @Column var start: LocalDateTime,
    @Column var finish: LocalDateTime,
    @Column var maxPersons: Int,
    @Column var active: Boolean,
    @Column var created: LocalDateTime,
    @Column var updated: LocalDateTime? = null,
) : DataObject<Offer> {
    companion object {
        fun create(request: OfferChangeRequest, timestamp: LocalDateTime): OfferData {
            return OfferData(0, request.start, request.finish, request.maxPersons, request.active, timestamp)
        }
    }

    override fun convert() = Offer(id, start, finish, maxPersons, active)

    fun update(request: OfferChangeRequest, timestamp: LocalDateTime): OfferData {
        start = request.start
        finish = request.finish
        maxPersons = request.maxPersons
        active = request.active
        updated = timestamp
        return this
    }
}
