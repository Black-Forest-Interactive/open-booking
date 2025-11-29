package de.sambalmueslie.openbooking.backend.export

import de.sambalmueslie.openbooking.backend.offer.api.OfferDetails
import io.micronaut.http.server.types.files.SystemFile
import java.time.LocalDate

interface Exporter {
    fun export(date: LocalDate, offer: List<OfferDetails>): SystemFile?
}
