package de.sambalmueslie.openbooking.core.visitor

import de.sambalmueslie.openbooking.common.EntityChangeListener
import de.sambalmueslie.openbooking.core.visitor.api.Visitor
import de.sambalmueslie.openbooking.core.visitor.api.VisitorChangeRequest

interface VisitorChangeListener : EntityChangeListener<Long, Visitor, VisitorChangeRequest> {}