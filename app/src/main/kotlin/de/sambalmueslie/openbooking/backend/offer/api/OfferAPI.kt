package de.sambalmueslie.openbooking.backend.offer.api

import de.sambalmueslie.openbooking.common.AuthCrudAPI
import de.sambalmueslie.openbooking.common.GenericRequestResult
import de.sambalmueslie.openbooking.common.PatchRequest
import io.micronaut.data.model.Page
import io.micronaut.data.model.Pageable
import io.micronaut.security.authentication.Authentication
import java.time.LocalDate

interface OfferAPI : AuthCrudAPI<Long, Offer, OfferChangeRequest> {
    companion object {
        const val PERMISSION_READ = "openbooking.offer.read"
        const val PERMISSION_WRITE = "openbooking.offer.write"
    }

    fun createSeries(auth: Authentication, request: OfferSeriesRequest): GenericRequestResult
    fun createRange(auth: Authentication, request: OfferRangeRequest): GenericRequestResult

    fun findByDate(auth: Authentication, date: LocalDate): List<Offer>

    fun setActive(auth: Authentication, id: Long, value: PatchRequest<Boolean>): Offer?
    fun setMaxPersons(auth: Authentication, id: Long, value: PatchRequest<Int>): Offer?

    fun filter(auth: Authentication, request: OfferFilterRequest, pageable: Pageable): Page<Offer>

}
