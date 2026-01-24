package de.sambalmueslie.openbooking.core.visitor

import de.sambalmueslie.openbooking.common.EntityChangeListener
import de.sambalmueslie.openbooking.core.visitor.api.Visitor

interface VisitorChangeListener : EntityChangeListener<Long, Visitor> {}