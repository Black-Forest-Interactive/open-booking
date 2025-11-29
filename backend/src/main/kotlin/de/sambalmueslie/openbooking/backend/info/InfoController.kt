package de.sambalmueslie.openbooking.backend.info


import de.sambalmueslie.openbooking.backend.info.api.DateRangeSelectionRequest
import io.micronaut.http.annotation.*
import io.swagger.v3.oas.annotations.tags.Tag
import java.time.LocalDate

@Controller("/api/backend/info")
@Tag(name = "Info API")
class InfoController(private val service: InfoService) {

    @Get("/day/{date}")
    fun getDayInfo(@PathVariable date: LocalDate) = service.getDayInfo(date)

    @Post("/day")
    fun getDayInfoRange(@Body request: DateRangeSelectionRequest) = service.getDayInfoRange(request)

}
