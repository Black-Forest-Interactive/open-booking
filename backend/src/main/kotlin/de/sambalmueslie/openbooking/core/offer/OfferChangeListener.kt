package de.sambalmueslie.openbooking.core.offer

import de.sambalmueslie.openbooking.common.EntityChangeListener
import de.sambalmueslie.openbooking.core.offer.api.Offer

interface OfferChangeListener : EntityChangeListener<Long, Offer> {
    fun handleBlockCreated(offers: List<Offer>) {
        // intentionally left empty
    }

    fun handleBlockUpdated(offers: List<Offer>) {
        // intentionally left empty
    }

}