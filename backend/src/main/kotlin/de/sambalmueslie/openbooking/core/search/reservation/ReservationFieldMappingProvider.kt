package de.sambalmueslie.openbooking.core.search.reservation

import com.jillesvangurp.searchdsls.mappingdsl.FieldMappings
import de.sambalmueslie.openbooking.core.search.common.FieldMappingProvider
import de.sambalmueslie.openbooking.core.search.reservation.db.ReservationSearchEntryData
import jakarta.inject.Singleton

@Singleton
@Deprecated("use booking directly instead")
class ReservationFieldMappingProvider : FieldMappingProvider {
    override fun createMappings(): FieldMappings.() -> Unit {
        return {
            number<Long>(ReservationSearchEntryData::id)
            keyword(ReservationSearchEntryData::key)
            keyword(ReservationSearchEntryData::status)
            text(ReservationSearchEntryData::comment)
            date(ReservationSearchEntryData::timestamp)
            // visitor
            number<Long>(ReservationSearchEntryData::visitorId)
            keyword(ReservationSearchEntryData::type)
            text(ReservationSearchEntryData::title)
            text(ReservationSearchEntryData::description)
            number<Int>(ReservationSearchEntryData::size)
            number<Int>(ReservationSearchEntryData::minAge)
            number<Int>(ReservationSearchEntryData::maxAge)
            text(ReservationSearchEntryData::name)
            keyword(ReservationSearchEntryData::street)
            keyword(ReservationSearchEntryData::city)
            keyword(ReservationSearchEntryData::zip)
            text(ReservationSearchEntryData::phone)
            // Email with multi-field: text for fuzzy search + keyword for exact/prefix
            text(ReservationSearchEntryData::email) {
                fields {
                    keyword("keyword")
                }
            }
            keyword(ReservationSearchEntryData::verificationStatus)
            date(ReservationSearchEntryData::verificationTimestamp)

            // offer
            number<Long>(ReservationSearchEntryData::offerId)
            date(ReservationSearchEntryData::start)
            date(ReservationSearchEntryData::finish)
            number<Int>(ReservationSearchEntryData::maxPersons)
            bool(ReservationSearchEntryData::active)
            // stats
            number<Int>(ReservationSearchEntryData::bookedSpace)
            number<Int>(ReservationSearchEntryData::reservedSpace)
            number<Int>(ReservationSearchEntryData::availableSpace)

        }
    }
}