package de.sambalmueslie.openbooking.core.label

import de.sambalmueslie.openbooking.common.BusinessObjectChangeListener
import de.sambalmueslie.openbooking.core.label.api.Label

interface LabelChangeListener : BusinessObjectChangeListener<Long, Label> {}