package de.sambalmueslie.openbooking.core.search.guide

import de.sambalmueslie.openbooking.core.guide.api.Guide
import de.sambalmueslie.openbooking.core.search.common.LocalDateTimeSerializer
import kotlinx.serialization.Serializable
import java.time.LocalDateTime

@Serializable
data class GuideSearchEntryData(
    var id: String,
    var name: String,
    var firstName: String,
    var lastName: String,
    var email: String,

    @Serializable(with = LocalDateTimeSerializer::class) var created: LocalDateTime,
    @Serializable(with = LocalDateTimeSerializer::class) var updated: LocalDateTime?,
    @Serializable(with = LocalDateTimeSerializer::class) var timestamp: LocalDateTime,
) {
    companion object {


        fun create(obj: Guide): GuideSearchEntryData {
            val name = (obj.firstName + " " + obj.lastName).trim()
            return GuideSearchEntryData(obj.id.toString(), name, obj.firstName, obj.lastName, obj.email, obj.created, obj.updated, obj.updated ?: obj.created)
        }
    }
}
