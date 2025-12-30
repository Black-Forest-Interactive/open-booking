package de.sambalmueslie.openbooking.core.search.guide

import com.jillesvangurp.searchdsls.mappingdsl.FieldMappings
import de.sambalmueslie.openbooking.core.search.common.FieldMappingProvider
import jakarta.inject.Singleton

@Singleton
class GuideFieldMappingProvider : FieldMappingProvider {
    override fun createMappings(): FieldMappings.() -> Unit {
        return {
            number<Long>("id")
            text("firstName")
            text("lastName")
            text("email")
        }
    }
}