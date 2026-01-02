package de.sambalmueslie.openbooking.gateway.admin.offer

import de.sambalmueslie.openbooking.common.PatchRequest
import de.sambalmueslie.openbooking.core.offer.api.OfferChangeRequest
import de.sambalmueslie.openbooking.core.offer.api.OfferFilterRequest
import de.sambalmueslie.openbooking.core.offer.api.OfferRangeRequest
import de.sambalmueslie.openbooking.core.offer.api.OfferSeriesRequest
import io.micronaut.data.model.Pageable
import io.micronaut.http.annotation.*
import io.micronaut.security.authentication.Authentication
import io.swagger.v3.oas.annotations.tags.Tag
import java.time.LocalDate


@Controller("/api/admin/offer")
@Tag(name = "Admin Offer API")
class OfferController(private val gateway: OfferGateway) {
    @Get()
    fun getAll(auth: Authentication, pageable: Pageable) = gateway.getAll(auth, pageable)

    @Get("info")
    fun getAllInfo(auth: Authentication, pageable: Pageable) = gateway.getAllInfo(auth, pageable)

    @Get("/{id}")
    fun get(auth: Authentication, id: Long) = gateway.get(auth, id)

    @Get("/find/{date}")
    fun findByDate(auth: Authentication, date: LocalDate) = gateway.findByDate(auth, date)

    @Patch("/{id}/active")
    fun setActive(auth: Authentication, id: Long, @Body value: PatchRequest<Boolean>) = gateway.setActive(auth, id, value)

    @Patch("/{id}/max_persons")
    fun setMaxPersons(auth: Authentication, id: Long, @Body value: PatchRequest<Int>) = gateway.setMaxPersons(auth, id, value)

    @Post()
    fun create(auth: Authentication, @Body request: OfferChangeRequest) = gateway.create(auth, request)

    @Put("/{id}")
    fun update(auth: Authentication, id: Long, @Body request: OfferChangeRequest) = gateway.update(auth, id, request)

    @Delete("/{id}")
    fun delete(auth: Authentication, id: Long) = gateway.delete(auth, id)

    @Post("/series")
    fun createSeries(auth: Authentication, @Body request: OfferSeriesRequest) = gateway.createSeries(auth, request)

    @Post("/range")
    fun createRange(auth: Authentication, @Body request: OfferRangeRequest) = gateway.createRange(auth, request)

    @Post("/filter")
    fun filter(auth: Authentication, @Body request: OfferFilterRequest, pageable: Pageable) = gateway.filter(auth, request, pageable)


    @Post("/filter/info")
    fun filterInfo(auth: Authentication, @Body request: OfferFilterRequest, pageable: Pageable) = gateway.filterInfo(auth, request, pageable)
}