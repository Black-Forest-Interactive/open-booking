package de.sambalmueslie.openbooking.core.booking.api

import de.sambalmueslie.openbooking.core.editor.api.Editor
import de.sambalmueslie.openbooking.core.offer.api.OfferReference
import de.sambalmueslie.openbooking.core.visitor.api.Visitor
import java.time.LocalDateTime

data class BookingDetails(
    val booking: Booking,
    val visitor: Visitor,
    val offer: OfferReference,
    val timestamp: LocalDateTime,
    val editor: Editor?
)
