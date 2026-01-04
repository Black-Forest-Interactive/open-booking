package de.sambalmueslie.openbooking.gateway.admin.offer

import de.sambalmueslie.openbooking.common.PatchRequest
import de.sambalmueslie.openbooking.common.checkPermission
import de.sambalmueslie.openbooking.core.offer.OfferService
import de.sambalmueslie.openbooking.core.offer.api.OfferChangeRequest
import de.sambalmueslie.openbooking.core.offer.api.OfferRangeRequest
import de.sambalmueslie.openbooking.core.offer.api.OfferSeriesRequest
import de.sambalmueslie.openbooking.core.search.offer.OfferSearchOperator
import de.sambalmueslie.openbooking.core.search.offer.api.OfferSearchRequest
import de.sambalmueslie.openbooking.gateway.admin.PERMISSION_OFFER_ADMIN
import io.micronaut.data.model.Pageable
import io.micronaut.security.authentication.Authentication
import jakarta.inject.Singleton
import java.time.LocalDate

@Singleton
class OfferGateway(
    private val service: OfferService,
    private val searchOperator: OfferSearchOperator
) {
    fun getAll(auth: Authentication, pageable: Pageable) = auth.checkPermission(PERMISSION_OFFER_ADMIN) { service.getAll(pageable) }
    fun getAllInfo(auth: Authentication, pageable: Pageable) = auth.checkPermission(PERMISSION_OFFER_ADMIN) { service.getAllInfos(pageable) }
    fun get(auth: Authentication, id: Long) = auth.checkPermission(PERMISSION_OFFER_ADMIN) { service.get(id) }
    fun search(auth: Authentication, request: OfferSearchRequest, pageable: Pageable) = auth.checkPermission(PERMISSION_OFFER_ADMIN) { searchOperator.search(request, pageable) }

    fun findByDate(auth: Authentication, date: LocalDate) = auth.checkPermission(PERMISSION_OFFER_ADMIN) { service.getOffer(date) }
    fun setActive(auth: Authentication, id: Long, value: PatchRequest<Boolean>) = auth.checkPermission(PERMISSION_OFFER_ADMIN) { service.setActive(id, value.value) }
    fun setMaxPersons(auth: Authentication, id: Long, value: PatchRequest<Int>) = auth.checkPermission(PERMISSION_OFFER_ADMIN) { service.setMaxPersons(id, value.value) }
    fun create(auth: Authentication, request: OfferChangeRequest) = auth.checkPermission(PERMISSION_OFFER_ADMIN) { service.create(request) }
    fun update(auth: Authentication, id: Long, request: OfferChangeRequest) = auth.checkPermission(PERMISSION_OFFER_ADMIN) { service.update(id, request) }
    fun delete(auth: Authentication, id: Long) = auth.checkPermission(PERMISSION_OFFER_ADMIN) { service.delete(id) }
    fun createSeries(auth: Authentication, request: OfferSeriesRequest) = auth.checkPermission(PERMISSION_OFFER_ADMIN) { service.createSeries(request) }
    fun createRange(auth: Authentication, request: OfferRangeRequest) = auth.checkPermission(PERMISSION_OFFER_ADMIN) { service.createRange(request) }
}