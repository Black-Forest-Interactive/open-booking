package de.sambalmueslie.openbooking.core.offer.db

import de.sambalmueslie.openbooking.common.EntityData
import de.sambalmueslie.openbooking.core.guide.api.Guide
import de.sambalmueslie.openbooking.core.label.api.Label
import de.sambalmueslie.openbooking.core.offer.api.Offer
import de.sambalmueslie.openbooking.core.offer.api.OfferChangeRequest
import jakarta.persistence.*
import java.time.LocalDateTime


@Entity(name = "Offer")
@Table(name = "offer")
data class OfferData(
    @Id @GeneratedValue var id: Long,
    @Column var start: LocalDateTime,
    @Column var finish: LocalDateTime,
    @Column var maxPersons: Int,
    @Column var active: Boolean,

    @Column var labelId: Long?,
    @Column var guideId: Long?,

    @Column var created: LocalDateTime,
    @Column var updated: LocalDateTime? = null,
) : EntityData<Offer> {

    override fun convert() = Offer(id, start, finish, maxPersons, active, created, updated)

    fun update(request: OfferChangeRequest, label: Label?, guide: Guide?, timestamp: LocalDateTime): OfferData {
        start = request.start
        finish = request.finish
        maxPersons = request.maxPersons
        active = request.active
        labelId = label?.id
        guideId = guide?.id
        updated = timestamp
        return this
    }

    fun update(start: LocalDateTime, finish: LocalDateTime, timestamp: LocalDateTime): OfferData {
        this.start = start
        this.finish = finish
        updated = timestamp
        return this
    }

    fun updateLabel(label: Label?, timestamp: LocalDateTime): OfferData {
        labelId = label?.id
        updated = timestamp
        return this
    }

    fun updateGuide(guide: Guide?, timestamp: LocalDateTime): OfferData {
        guideId = guide?.id
        updated = timestamp
        return this
    }

    fun updateMaxPersons(maxPersons: Int, timestamp: LocalDateTime): OfferData {
        this.maxPersons = maxPersons
        updated = timestamp
        return this
    }

    fun updateActive(active: Boolean, timestamp: LocalDateTime): OfferData {
        this.active = active
        updated = timestamp
        return this
    }
}
