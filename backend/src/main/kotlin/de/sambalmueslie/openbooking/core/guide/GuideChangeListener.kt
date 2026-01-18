package de.sambalmueslie.openbooking.core.guide

import de.sambalmueslie.openbooking.common.EntityChangeListener
import de.sambalmueslie.openbooking.core.guide.api.Guide

interface GuideChangeListener : EntityChangeListener<Long, Guide> {
}