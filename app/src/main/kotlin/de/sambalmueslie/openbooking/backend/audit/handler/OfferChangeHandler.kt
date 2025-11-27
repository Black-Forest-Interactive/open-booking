package de.sambalmueslie.openbooking.backend.audit.handler


import de.sambalmueslie.openbooking.backend.audit.AuditLogEntryService
import de.sambalmueslie.openbooking.backend.audit.api.AuditLogEntryChangeRequest
import de.sambalmueslie.openbooking.backend.audit.api.AuditLogLevel
import de.sambalmueslie.openbooking.backend.offer.OfferService
import de.sambalmueslie.openbooking.backend.offer.api.Offer
import de.sambalmueslie.openbooking.common.BusinessObjectChangeListener
import de.sambalmueslie.openbooking.common.TimeProvider
import io.micronaut.context.annotation.Context

@Context
class OfferChangeHandler(
    source: OfferService,
    private val service: AuditLogEntryService,
    private val timeProvider: TimeProvider
) : BusinessObjectChangeListener<Long, Offer> {

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
        service.create(AuditLogEntryChangeRequest(timeProvider.now(), "system", AuditLogLevel.INFO, message,obj.id.toString(), obj, "OFFER API"))
    }

}
