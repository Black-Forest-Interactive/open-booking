package de.sambalmueslie.openbooking.core.search.guide

import com.jillesvangurp.searchdsls.mappingdsl.FieldMappings
import de.sambalmueslie.openbooking.core.search.common.FieldMappingProvider
import jakarta.inject.Singleton

@Singleton
class GuideFieldMappingProvider : FieldMappingProvider {
    override fun createMappings(): FieldMappings.() -> Unit {
        return {
            number<Long>(GuideSearchEntryData::id)
            text(GuideSearchEntryData::name)
            text(GuideSearchEntryData::firstName)
            text(GuideSearchEntryData::lastName)
            text(GuideSearchEntryData::email)
            date(GuideSearchEntryData::created)
            date(GuideSearchEntryData::updated)
            date(GuideSearchEntryData::timestamp)
        }
    }
}