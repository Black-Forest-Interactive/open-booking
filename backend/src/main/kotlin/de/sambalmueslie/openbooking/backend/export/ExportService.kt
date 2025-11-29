package de.sambalmueslie.openbooking.backend.export


import de.sambalmueslie.openbooking.backend.export.excel.ExcelExporter
import de.sambalmueslie.openbooking.backend.offer.OfferService
import de.sambalmueslie.openbooking.backend.offer.api.OfferDetails
import de.sambalmueslie.openbooking.backend.request.BookingRequestService
import de.sambalmueslie.openbooking.common.measureTimeMillisWithReturn
import io.micronaut.http.server.types.files.SystemFile
import jakarta.inject.Singleton
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import java.time.LocalDate

@Singleton
class ExportService(
    private val pdfExporter: PdfExporter,
    private val excelExporter: ExcelExporter,
    private val requestService: BookingRequestService,
    private val offerService: OfferService
) {

    companion object {
        private val logger: Logger = LoggerFactory.getLogger(ExportService::class.java)
    }

    fun createDailyReportPdf(date: LocalDate): SystemFile? {
        return createDailyReport(date, pdfExporter)
    }

    fun createDailyReportExcel(date: LocalDate): SystemFile? {
        return createDailyReport(date, excelExporter)
    }

    private fun createDailyReport(date: LocalDate, exporter: Exporter): SystemFile? {
        val (duration, result) = measureTimeMillisWithReturn {
            val offer = offerService.getOffer(date).map {
                OfferDetails(it, requestService.findByOfferId(it.id))
            }
            exporter.export(date, offer) ?: return@measureTimeMillisWithReturn null
        }
        logger.info("Created daily report for $date within $duration ms")
        return result
    }

}
