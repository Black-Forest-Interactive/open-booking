package de.sambalmueslie.openbooking.core.search.reservation

import com.jillesvangurp.searchdsls.mappingdsl.FieldMappings
import de.sambalmueslie.openbooking.core.search.common.FieldMappingProvider
import de.sambalmueslie.openbooking.core.search.reservation.db.ReservationOfferEntryData
import de.sambalmueslie.openbooking.core.search.reservation.db.ReservationSearchEntryData
import jakarta.inject.Singleton

@Singleton
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
            nestedField(ReservationSearchEntryData::offers) {
                number<Long>(ReservationOfferEntryData::offerId)
                date(ReservationOfferEntryData::start)
                date(ReservationOfferEntryData::finish)
                number<Int>(ReservationOfferEntryData::maxPersons)
                bool(ReservationOfferEntryData::active)
                // stats
                number<Int>(ReservationOfferEntryData::bookedSpace)
                number<Int>(ReservationOfferEntryData::reservedSpace)
                number<Int>(ReservationOfferEntryData::availableSpace)
                number<Int>(ReservationOfferEntryData::priority)
            }
        }
    }
}