package de.sambalmueslie.openbooking.core.offer

import de.sambalmueslie.openbooking.common.EntityChangeListener
import de.sambalmueslie.openbooking.core.offer.api.Offer
import de.sambalmueslie.openbooking.core.offer.api.OfferChangeRequest

interface OfferChangeListener : EntityChangeListener<Long, Offer, OfferChangeRequest> {
    fun handleBlockCreated(offers: List<Offer>) {
        // intentionally left empty
    }

    fun handleBlockUpdated(offers: List<Offer>) {
        // intentionally left empty
    }

}