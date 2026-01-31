package de.sambalmueslie.openbooking.core.guide

import de.sambalmueslie.openbooking.common.EntityChangeListener
import de.sambalmueslie.openbooking.core.guide.api.Guide
import de.sambalmueslie.openbooking.core.guide.api.GuideChangeRequest

interface GuideChangeListener : EntityChangeListener<Long, Guide, GuideChangeRequest> {
}