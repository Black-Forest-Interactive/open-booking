package de.sambalmueslie.openbooking.core.claim.api

import de.sambalmueslie.openbooking.common.EntityChangeListener

interface ClaimChangeListener : EntityChangeListener<Long, Claim, ClaimChangeRequest> {}