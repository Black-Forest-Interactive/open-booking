package de.sambalmueslie.openbooking.core.search.guide

import de.sambalmueslie.openbooking.core.guide.api.Guide
import kotlinx.serialization.Serializable

@Serializable
data class GuideSearchEntryData(
    var id: String,
    var firstName: String,
    var lastName: String,
    var email: String,
) {
    companion object {


        fun create(obj: Guide): GuideSearchEntryData {
            return GuideSearchEntryData(
                obj.id.toString(), obj.firstName, obj.lastName, obj.email
            )
        }
    }
}
