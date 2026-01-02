package de.sambalmueslie.openbooking.core.offer.db

import de.sambalmueslie.openbooking.common.DataObject
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
) : DataObject<Offer> {

    override fun convert() = Offer(id, start, finish, maxPersons, active)

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
}
