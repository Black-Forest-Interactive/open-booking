package de.sambalmueslie.openbooking.infrastructure.event.handler

import de.sambalmueslie.openbooking.core.offer.OfferChangeListener
import de.sambalmueslie.openbooking.core.offer.OfferService
import de.sambalmueslie.openbooking.core.offer.api.Offer
import de.sambalmueslie.openbooking.infrastructure.event.EventService
import io.micronaut.context.annotation.Context

@Context
class OfferChangeHandler(
    service: OfferService,
    queue: EventService
) : EntityChangeHandler<Long, Offer>(Offer::class, queue), OfferChangeListener {

    init {
        service.register(this)
    }

    override fun handleBlockCreated(offers: List<Offer>) {
        offers.forEach { o -> handleCreated(o) }
    }

    override fun handleBlockUpdated(offers: List<Offer>) {
        offers.forEach { o -> handleUpdated(o) }
    }

    override fun getStatus(obj: Offer): String {
        return if (obj.active) "active" else "disabled"
    }
}