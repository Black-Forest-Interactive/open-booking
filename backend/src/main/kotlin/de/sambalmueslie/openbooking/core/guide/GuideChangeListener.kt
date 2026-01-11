package de.sambalmueslie.openbooking.core.guide

import de.sambalmueslie.openbooking.common.BusinessObjectChangeListener
import de.sambalmueslie.openbooking.core.guide.api.Guide

interface GuideChangeListener : BusinessObjectChangeListener<Long, Guide> {
}