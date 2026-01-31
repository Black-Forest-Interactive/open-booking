package de.sambalmueslie.openbooking.core.response

import de.sambalmueslie.openbooking.common.EntityChangeListener
import de.sambalmueslie.openbooking.core.response.api.Response
import de.sambalmueslie.openbooking.core.response.api.ResponseChangeRequest

interface ResponseChangeListener : EntityChangeListener<Long, Response, ResponseChangeRequest> {}