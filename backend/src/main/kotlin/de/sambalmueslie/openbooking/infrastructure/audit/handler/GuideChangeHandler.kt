package de.sambalmueslie.openbooking.infrastructure.audit.handler


import de.sambalmueslie.openbooking.common.TimeProvider
import de.sambalmueslie.openbooking.core.guide.GuideChangeListener
import de.sambalmueslie.openbooking.core.guide.GuideService
import de.sambalmueslie.openbooking.core.guide.api.Guide
import de.sambalmueslie.openbooking.infrastructure.audit.AuditLogEntryService
import de.sambalmueslie.openbooking.infrastructure.audit.api.AuditLogEntryChangeRequest
import de.sambalmueslie.openbooking.infrastructure.audit.api.AuditLogLevel
import io.micronaut.context.annotation.Context

@Context
class GuideChangeHandler(
    source: GuideService,
    private val service: AuditLogEntryService,
    private val timeProvider: TimeProvider
) : GuideChangeListener {

    init {
        source.register(this)
    }

    override fun handleCreated(obj: Guide) {
        handleChange(obj, "GUIDE CREATED")
    }

    override fun handleUpdated(obj: Guide) {
        handleChange(obj, "GUIDE UPDATED")
    }

    override fun handleDeleted(obj: Guide) {
        handleChange(obj, "GUIDE DELETED")
    }

    private fun handleChange(obj: Guide, message: String) {
        service.create(AuditLogEntryChangeRequest(timeProvider.now(), "system", AuditLogLevel.INFO, message, obj.id.toString(), obj, "GUIDE API"))
    }

}
