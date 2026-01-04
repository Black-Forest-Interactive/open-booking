package de.sambalmueslie.openbooking.core.search.offer

import com.jillesvangurp.searchdsls.mappingdsl.FieldMappings
import de.sambalmueslie.openbooking.core.search.common.FieldMappingProvider
import de.sambalmueslie.openbooking.core.search.offer.db.OfferBookingEntryData
import de.sambalmueslie.openbooking.core.search.offer.db.OfferReservationEntryData
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
            // stats
            number<Int>(OfferSearchEntryData::bookedSpace)
            number<Int>(OfferSearchEntryData::reservedSpace)
            number<Int>(OfferSearchEntryData::availableSpace)
            // reservations
            nestedField(OfferSearchEntryData::reservations) {
                number<Long>(OfferReservationEntryData::reservationId)
                keyword(OfferReservationEntryData::status)
                // visitor
                number<Long>(OfferReservationEntryData::visitorId)
                keyword(OfferReservationEntryData::type)
                text(OfferReservationEntryData::title)
                text(OfferReservationEntryData::description)
                number<Int>(OfferReservationEntryData::size)
                number<Int>(OfferReservationEntryData::minAge)
                number<Int>(OfferReservationEntryData::maxAge)
                text(OfferReservationEntryData::name)
                keyword(OfferReservationEntryData::street)
                keyword(OfferReservationEntryData::city)
                keyword(OfferReservationEntryData::zip)
                text(OfferReservationEntryData::phone)
                text(OfferReservationEntryData::email)
                keyword(OfferReservationEntryData::verificationStatus)
                date(OfferReservationEntryData::verificationTimestamp)
            }
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