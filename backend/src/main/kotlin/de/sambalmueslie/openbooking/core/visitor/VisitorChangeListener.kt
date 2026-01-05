package de.sambalmueslie.openbooking.core.visitor

import de.sambalmueslie.openbooking.common.BusinessObjectChangeListener
import de.sambalmueslie.openbooking.core.visitor.api.Visitor

interface VisitorChangeListener : BusinessObjectChangeListener<Long, Visitor> {}