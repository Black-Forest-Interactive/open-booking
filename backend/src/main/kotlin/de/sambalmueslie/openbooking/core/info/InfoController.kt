package de.sambalmueslie.openbooking.core.info


import de.sambalmueslie.openbooking.core.info.api.DateRangeSelectionRequest
import io.micronaut.http.annotation.*
import io.swagger.v3.oas.annotations.tags.Tag
import java.time.LocalDate

@Controller("/api/backend/info")
@Tag(name = "Info API")
@Deprecated("move that to gateway")
class InfoController(private val service: InfoService) {

    @Get("/day/{date}")
    fun getDayInfo(@PathVariable date: LocalDate) = service.getDayInfo(date)

    @Post("/day")
    fun getDayInfoRange(@Body request: DateRangeSelectionRequest) = service.getDayInfoRange(request)

}
