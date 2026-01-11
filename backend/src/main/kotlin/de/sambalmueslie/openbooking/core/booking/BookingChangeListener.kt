package de.sambalmueslie.openbooking.core.booking

import de.sambalmueslie.openbooking.common.BusinessObjectChangeListener
import de.sambalmueslie.openbooking.core.booking.api.Booking

interface BookingChangeListener : BusinessObjectChangeListener<Long, Booking> {
}