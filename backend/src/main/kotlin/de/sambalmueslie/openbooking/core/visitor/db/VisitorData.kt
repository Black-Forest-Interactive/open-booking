package de.sambalmueslie.openbooking.core.visitor.db

import de.sambalmueslie.openbooking.common.EntityData
import de.sambalmueslie.openbooking.core.visitor.api.*
import jakarta.persistence.*
import java.time.LocalDateTime

@Entity(name = "Visitor")
@Table(name = "visitor")
data class VisitorData(
    @Id @GeneratedValue var id: Long,
    @Column @Enumerated(EnumType.STRING) var type: VisitorType,
    @Column var title: String,
    @Column var description: String,

    @Column var size: Int,
    @Column var minAge: Int,
    @Column var maxAge: Int,

    @Column var name: String,
    @Column var street: String,
    @Column var city: String,
    @Column var zip: String,
    @Column var phone: String,
    @Column var email: String,

    @Column @Enumerated(EnumType.STRING) var verificationStatus: VerificationStatus,
    @Column var verifiedAt: LocalDateTime?,

    @Column var created: LocalDateTime,
    @Column var updated: LocalDateTime? = null,
) : EntityData<Visitor> {
    companion object {
        fun create(request: VisitorChangeRequest, timestamp: LocalDateTime): VisitorData {
            return VisitorData(
                0,
                request.type,
                request.title,
                request.description,
                request.size,
                request.minAge,
                request.maxAge,
                request.name,
                request.address.street,
                request.address.city,
                request.address.zip,
                request.phone,
                request.email,
                VerificationStatus.UNCONFIRMED,
                null,
                timestamp
            )
        }
    }

    override fun convert() = Visitor(id, type, title, description, size, minAge, maxAge, name, Address(street, city, zip), phone, email, Verification(verificationStatus, verifiedAt))

    fun update(request: VisitorChangeRequest, timestamp: LocalDateTime): VisitorData {
        type = request.type
        title = request.title
        description = request.description
        size = request.size
        minAge = request.minAge
        maxAge = request.maxAge
        name = request.name
        street = request.address.street
        zip = request.address.zip
        city = request.address.city
        phone = request.phone
        email = request.email
        updated = timestamp
        return this
    }

    fun update(status: VerificationStatus, timestamp: LocalDateTime): VisitorData {
        this.verificationStatus = status
        this.verifiedAt = timestamp
        updated = timestamp
        return this
    }
}
