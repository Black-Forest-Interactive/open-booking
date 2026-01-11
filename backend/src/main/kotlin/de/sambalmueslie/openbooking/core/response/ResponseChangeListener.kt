package de.sambalmueslie.openbooking.core.response

import de.sambalmueslie.openbooking.common.BusinessObjectChangeListener
import de.sambalmueslie.openbooking.core.response.api.Response

interface ResponseChangeListener : BusinessObjectChangeListener<Long, Response> {}