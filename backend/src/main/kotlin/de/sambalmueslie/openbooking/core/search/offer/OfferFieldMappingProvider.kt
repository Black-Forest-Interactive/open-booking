package de.sambalmueslie.openbooking.core.search.offer

import com.jillesvangurp.searchdsls.mappingdsl.FieldMappings
import de.sambalmueslie.openbooking.core.search.common.FieldMappingProvider
import de.sambalmueslie.openbooking.core.search.offer.db.OfferBookingEntryData
import de.sambalmueslie.openbooking.core.search.offer.db.OfferSearchEntryData
import jakarta.inject.Singleton

@Singleton
class OfferFieldMappingProvider : FieldMappingProvider {
    override fun createMappings(): FieldMappings.() -> Unit {
        return {
            number<Long>(OfferSearchEntryData::id)
            date(OfferSearchEntryData::start)
            date(OfferSearchEntryData::finish)
            number<Int>(OfferSearchEntryData::maxPersons)
            bool(OfferSearchEntryData::active)
            date(OfferSearchEntryData::created)
            date(OfferSearchEntryData::updated)
            date(OfferSearchEntryData::timestamp)
            // stats
            number<Int>(OfferSearchEntryData::bookedSpace)
            number<Int>(OfferSearchEntryData::reservedSpace)
            number<Int>(OfferSearchEntryData::availableSpace)
            // bookings
            nestedField(OfferSearchEntryData::bookings) {
                number<Long>(OfferBookingEntryData::bookingId)
                keyword(OfferBookingEntryData::status)
                // visitor
                number<Long>(OfferBookingEntryData::visitorId)
                keyword(OfferBookingEntryData::type)
                text(OfferBookingEntryData::title)
                text(OfferBookingEntryData::description)
                number<Int>(OfferBookingEntryData::size)
                number<Int>(OfferBookingEntryData::minAge)
                number<Int>(OfferBookingEntryData::maxAge)
                text(OfferBookingEntryData::name)
                keyword(OfferBookingEntryData::street)
                keyword(OfferBookingEntryData::city)
                keyword(OfferBookingEntryData::zip)
                text(OfferBookingEntryData::phone)
                text(OfferBookingEntryData::email)
                keyword(OfferBookingEntryData::verificationStatus)
                date(OfferBookingEntryData::verificationTimestamp)
            }
        }
    }
}