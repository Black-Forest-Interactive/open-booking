package de.sambalmueslie.openbooking.core.role.db

import de.sambalmueslie.openbooking.core.role.api.TourRole
import de.sambalmueslie.openbooking.core.role.api.TourRoleChangeRequest
import de.sambalmueslie.openbooking.common.DataObject
import jakarta.persistence.*
import java.time.LocalDateTime

@Suppress("JpaObjectClassSignatureInspection")
@Entity(name = "TourRole")
@Table(name = "tour_role")
data class TourRoleData(
    @Id @GeneratedValue(strategy = GenerationType.SEQUENCE) var id: Long,
    @Column var name: String,
    @Column var description: String,
    @Column var created: LocalDateTime,
    @Column var updated: LocalDateTime? = null,
) : DataObject<TourRole> {
    companion object {
        fun create(request: TourRoleChangeRequest, timestamp: LocalDateTime): TourRoleData {
            return TourRoleData(0, request.name, request.description, timestamp)
        }
    }

    override fun convert() = TourRole(id, name, description)

    fun update(request: TourRoleChangeRequest, timestamp: LocalDateTime): TourRoleData {
        name = request.name
        description = request.description
        updated = timestamp
        return this
    }
}
