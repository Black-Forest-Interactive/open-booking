package de.sambalmueslie.openbooking.infrastructure.audit.handler


import de.sambalmueslie.openbooking.common.TimeProvider
import de.sambalmueslie.openbooking.core.offer.OfferChangeListener
import de.sambalmueslie.openbooking.core.offer.OfferService
import de.sambalmueslie.openbooking.core.offer.api.Offer
import de.sambalmueslie.openbooking.infrastructure.audit.AuditLogEntryService
import de.sambalmueslie.openbooking.infrastructure.audit.api.AuditLogEntryChangeRequest
import de.sambalmueslie.openbooking.infrastructure.audit.api.AuditLogLevel
import io.micronaut.context.annotation.Context

@Context
class OfferChangeHandler(
    source: OfferService,
    private val service: AuditLogEntryService,
    private val timeProvider: TimeProvider
) : OfferChangeListener {

    init {
        source.register(this)
    }

    override fun handleCreated(obj: Offer) {
        handleChange(obj, "OFFER CREATED")
    }

    override fun handleUpdated(obj: Offer) {
        handleChange(obj, "OFFER UPDATED")
    }

    override fun handleDeleted(obj: Offer) {
        handleChange(obj, "OFFER DELETED")
    }

    private fun handleChange(obj: Offer, message: String) {
        service.create(AuditLogEntryChangeRequest(timeProvider.now(), "system", AuditLogLevel.INFO, message, obj.id.toString(), obj, "OFFER API"))
    }

}
