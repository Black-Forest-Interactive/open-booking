package de.sambalmueslie.openbooking.core.label

import de.sambalmueslie.openbooking.common.EntityChangeListener
import de.sambalmueslie.openbooking.core.label.api.Label

interface LabelChangeListener : EntityChangeListener<Long, Label> {}