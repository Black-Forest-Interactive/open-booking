package de.sambalmueslie.openbooking.core.offer

import de.sambalmueslie.openbooking.common.BusinessObjectChangeListener
import de.sambalmueslie.openbooking.core.offer.api.Offer

interface OfferChangeListener : BusinessObjectChangeListener<Long, Offer> {}