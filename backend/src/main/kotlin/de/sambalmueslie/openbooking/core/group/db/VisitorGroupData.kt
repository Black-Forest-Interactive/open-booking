package de.sambalmueslie.openbooking.core.group.db

import de.sambalmueslie.openbooking.common.DataObject
import de.sambalmueslie.openbooking.core.group.api.Address
import de.sambalmueslie.openbooking.core.group.api.VisitorGroup
import de.sambalmueslie.openbooking.core.group.api.VisitorGroupChangeRequest
import de.sambalmueslie.openbooking.core.group.api.VisitorGroupStatus
import jakarta.persistence.*
import java.time.LocalDateTime

@Suppress("JpaObjectClassSignatureInspection")
@Entity(name = "VisitorGroup")
@Table(name = "visitor_group")
data class VisitorGroupData(
    @Id @GeneratedValue(strategy = GenerationType.SEQUENCE) var id: Long,
    @Column var title: String,
    @Column var size: Int,
    @Column var isGroup: Boolean,
    @Column var minAge: Int,
    @Column var maxAge: Int,
    @Column var contact: String,
    @Column var street: String,
    @Column var city: String,
    @Column var zip: String,
    @Column var phone: String,
    @Column var email: String,
    @Column @Enumerated(EnumType.STRING) var status: VisitorGroupStatus,
    @Column var created: LocalDateTime,
    @Column var updated: LocalDateTime? = null,
) : DataObject<VisitorGroup> {
    companion object {
        fun create(request: VisitorGroupChangeRequest, timestamp: LocalDateTime): VisitorGroupData {
            return VisitorGroupData(
                0,
                request.title,
                request.size,
                request.isGroup,
                request.minAge,
                request.maxAge,
                request.contact,
                request.address.street,
                request.address.city,
                request.address.zip,
                request.phone,
                request.email,
                VisitorGroupStatus.UNCONFIRMED,
                timestamp
            )
        }
    }

    override fun convert() = VisitorGroup(id, title, size, isGroup, minAge, maxAge, contact, Address(street, city, zip), phone, email, status)

    fun update(request: VisitorGroupChangeRequest, timestamp: LocalDateTime): VisitorGroupData {
        title = request.title
        size = request.size
        isGroup = request.isGroup
        minAge = request.minAge
        maxAge = request.maxAge
        contact = request.contact
        street = request.address.street
        zip = request.address.zip
        city = request.address.city
        phone = request.phone
        email = request.email
        updated = timestamp
        return this
    }

    fun update(status: VisitorGroupStatus, timestamp: LocalDateTime): VisitorGroupData {
        this.status = status
        updated = timestamp
        return this
    }
}
