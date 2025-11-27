package de.sambalmueslie.openbooking.backend.offer


import de.sambalmueslie.openbooking.backend.offer.api.*
import de.sambalmueslie.openbooking.backend.offer.api.OfferAPI.Companion.PERMISSION_READ
import de.sambalmueslie.openbooking.backend.offer.api.OfferAPI.Companion.PERMISSION_WRITE
import de.sambalmueslie.openbooking.common.PatchRequest
import de.sambalmueslie.openbooking.common.checkPermission
import io.micronaut.data.model.Page
import io.micronaut.data.model.Pageable
import io.micronaut.http.annotation.*
import io.micronaut.security.authentication.Authentication
import io.swagger.v3.oas.annotations.tags.Tag
import java.time.LocalDate

@Controller("/api/backend/offer")
@Tag(name = "Offer API")
class OfferController(private val service: OfferService) : OfferAPI {

    @Get()
    override fun getAll(auth: Authentication, pageable: Pageable) = auth.checkPermission(PERMISSION_READ) { service.getAll(pageable) }

    @Get("/{id}")
    override fun get(auth: Authentication, @PathVariable id: Long) = auth.checkPermission(PERMISSION_READ) { service.get(id) }

    @Get("/find/{date}")
    override fun findByDate(auth: Authentication, @PathVariable date: LocalDate) = auth.checkPermission(PERMISSION_READ) { service.getOffer(date) }

    @Patch("/{id}/active")
    override fun setActive(auth: Authentication, @PathVariable id: Long, @Body value: PatchRequest<Boolean>)=
        auth.checkPermission(PERMISSION_WRITE) { service.setActive(id, value.value) }

    @Patch("/{id}/max_persons")
    override fun setMaxPersons(auth: Authentication, @PathVariable id: Long, @Body value: PatchRequest<Int>) =
        auth.checkPermission(PERMISSION_WRITE) { service.setMaxPersons(id, value.value) }


    @Post()
    override fun create(auth: Authentication, @Body request: OfferChangeRequest) =
        auth.checkPermission(PERMISSION_WRITE) { service.create(request) }

    @Put("/{id}")
    override fun update(auth: Authentication, @PathVariable id: Long, @Body request: OfferChangeRequest) =
        auth.checkPermission(PERMISSION_WRITE) { service.update(id, request) }

    @Delete("/{id}")
    override fun delete(auth: Authentication, @PathVariable id: Long) =
        auth.checkPermission(PERMISSION_WRITE) { service.delete(id) }


    @Post("/series")
    override fun createSeries(auth: Authentication, @Body request: OfferSeriesRequest) =
        auth.checkPermission(PERMISSION_WRITE) { service.createSeries(request) }

    @Post("/range")
    override fun createRange(auth: Authentication, request: OfferRangeRequest) =
        auth.checkPermission(PERMISSION_WRITE) { service.createRange(request) }

    @Post("/filter")
    override fun filter(auth: Authentication, @Body request: OfferFilterRequest, pageable: Pageable) =
        auth.checkPermission(PERMISSION_READ) { service.filter(request, pageable) }

}
