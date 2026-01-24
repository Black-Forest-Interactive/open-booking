package de.sambalmueslie.openbooking.core.search.booking

import com.jillesvangurp.searchdsls.mappingdsl.FieldMappings
import de.sambalmueslie.openbooking.core.search.common.FieldMappingProvider
import jakarta.inject.Singleton

@Singleton
class BookingFieldMappingProvider : FieldMappingProvider {
    override fun createMappings(): FieldMappings.() -> Unit {
        return {
            number<Long>(BookingSearchEntryData::id)
            keyword(BookingSearchEntryData::key)
            keyword(BookingSearchEntryData::status)
            text(BookingSearchEntryData::comment)
            keyword(BookingSearchEntryData::lang)
            date(BookingSearchEntryData::created)
            date(BookingSearchEntryData::updated)
            date(BookingSearchEntryData::timestamp)
            // visitor
            number<Long>(BookingSearchEntryData::visitorId)
            keyword(BookingSearchEntryData::type)
            text(BookingSearchEntryData::title)
            text(BookingSearchEntryData::description)
            number<Int>(BookingSearchEntryData::size)
            number<Int>(BookingSearchEntryData::minAge)
            number<Int>(BookingSearchEntryData::maxAge)
            text(BookingSearchEntryData::name)
            keyword(BookingSearchEntryData::street)
            keyword(BookingSearchEntryData::city)
            keyword(BookingSearchEntryData::zip)
            text(BookingSearchEntryData::phone)
            // Email with multi-field: text for fuzzy search + keyword for exact/prefix
            text(BookingSearchEntryData::email) {
                fields {
                    keyword("keyword")
                }
            }
            keyword(BookingSearchEntryData::verificationStatus)
            date(BookingSearchEntryData::verificationTimestamp)

            // offer
            number<Long>(BookingSearchEntryData::offerId)
            date(BookingSearchEntryData::start)
            date(BookingSearchEntryData::finish)
            number<Int>(BookingSearchEntryData::maxPersons)
            bool(BookingSearchEntryData::active)
            // stats
            number<Int>(BookingSearchEntryData::confirmedSpace)
            number<Int>(BookingSearchEntryData::pendingSpace)
            number<Int>(BookingSearchEntryData::availableSpace)

        }
    }
}