package de.sambalmueslie.openbooking.core.claim.api

import de.sambalmueslie.openbooking.common.BusinessObjectChangeListener

interface ClaimChangeListener : BusinessObjectChangeListener<Long, Claim> {}