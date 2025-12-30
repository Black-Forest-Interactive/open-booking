package de.sambalmueslie.openbooking.infrastructure.export

import de.sambalmueslie.openbooking.core.offer.api.OfferDetails
import io.micronaut.http.server.types.files.SystemFile
import java.time.LocalDate

interface Exporter {
    fun export(date: LocalDate, offer: List<OfferDetails>): SystemFile?
}
