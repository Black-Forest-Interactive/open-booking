package de.sambalmueslie.openbooking.core.guide.db

import de.sambalmueslie.openbooking.common.EntityData
import de.sambalmueslie.openbooking.core.guide.api.Guide
import de.sambalmueslie.openbooking.core.guide.api.GuideChangeRequest
import jakarta.persistence.*
import java.time.LocalDateTime

@Entity(name = "Guide")
@Table(name = "guide")
data class GuideData(
    @Id @GeneratedValue var id: Long,
    @Column var firstName: String,
    @Column var lastName: String,
    @Column var email: String,
    @Column var phone: String,
    @Column var mobile: String,
    @Column var created: LocalDateTime,
    @Column var updated: LocalDateTime? = null,
) : EntityData<Guide> {
    companion object {
        fun create(request: GuideChangeRequest, timestamp: LocalDateTime): GuideData {
            return GuideData(0, request.firstName, request.lastName, request.email, request.phone, request.mobile, timestamp)
        }
    }

    override fun convert() = Guide(id, firstName, lastName, email, phone, mobile)

    fun update(request: GuideChangeRequest, timestamp: LocalDateTime): GuideData {
        firstName = request.firstName
        lastName = request.lastName
        email = request.email
        phone = request.phone
        mobile = request.mobile
        updated = timestamp
        return this
    }
}
