package de.sambalmueslie.openbooking.core.reservation.api

import de.sambalmueslie.openbooking.core.editor.api.Editor
import de.sambalmueslie.openbooking.core.visitor.api.Visitor
import java.time.LocalDateTime

data class ReservationDetails(
    val reservation: Reservation,
    val visitor: Visitor,
    val offer: ReservationOffer,
    val timestamp: LocalDateTime,
    val editor: Editor?
)
