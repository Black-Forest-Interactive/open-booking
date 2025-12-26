package de.sambalmueslie.openbooking.core.staff.db

import de.sambalmueslie.openbooking.core.staff.api.StaffMember
import de.sambalmueslie.openbooking.core.staff.api.StaffMemberChangeRequest
import de.sambalmueslie.openbooking.common.DataObject
import jakarta.persistence.*
import java.time.LocalDateTime

@Suppress("JpaObjectClassSignatureInspection")
@Entity(name = "StaffMember")
@Table(name = "staff_member")
data class StaffMemberData(
    @Id @GeneratedValue(strategy = GenerationType.SEQUENCE) var id: Long,
    @Column var firstName: String,
    @Column var lastName: String,
    @Column var email: String,
    @Column var phone: String,
    @Column var mobile: String,
    @Column var created: LocalDateTime,
    @Column var updated: LocalDateTime? = null,
) : DataObject<StaffMember> {
    companion object {
        fun create(request: StaffMemberChangeRequest, timestamp: LocalDateTime): StaffMemberData {
            return StaffMemberData(0, request.firstName, request.lastName, request.email, request.phone, request.mobile, timestamp)
        }
    }

    override fun convert() = StaffMember(id, firstName, lastName, email, phone, mobile)

    fun update(request: StaffMemberChangeRequest, timestamp: LocalDateTime): StaffMemberData {
        firstName = request.firstName
        lastName = request.lastName
        email = request.email
        phone = request.phone
        mobile = request.mobile
        updated = timestamp
        return this
    }
}
