package de.sambalmueslie.openbooking.core.label.db

import de.sambalmueslie.openbooking.common.EntityData
import de.sambalmueslie.openbooking.core.label.api.Label
import de.sambalmueslie.openbooking.core.label.api.LabelChangeRequest
import jakarta.persistence.*
import java.time.LocalDateTime

@Entity(name = "Label")
@Table(name = "label")
data class LabelData(
    @Id @GeneratedValue var id: Long,
    @Column var name: String,
    @Column var color: String,
    @Column var priority: Int,

    @Column var created: LocalDateTime,
    @Column var updated: LocalDateTime? = null,
) : EntityData<Label> {

    companion object {
        fun create(request: LabelChangeRequest, timestamp: LocalDateTime): LabelData {
            return LabelData(0, request.name, request.color, request.priority, timestamp)
        }
    }

    override fun convert() = Label(id, name, color, priority, created, updated)

    fun update(request: LabelChangeRequest, timestamp: LocalDateTime): LabelData {
        name = request.name
        color = request.color
        priority = request.priority
        updated = timestamp
        return this
    }
}
