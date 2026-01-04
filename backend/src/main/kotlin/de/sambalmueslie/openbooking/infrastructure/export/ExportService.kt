package de.sambalmueslie.openbooking.infrastructure.export


import de.sambalmueslie.openbooking.common.measureTimeMillisWithReturn
import de.sambalmueslie.openbooking.core.offer.assembler.OfferDetailsAssembler
import de.sambalmueslie.openbooking.infrastructure.export.excel.ExcelExporter
import io.micronaut.http.server.types.files.SystemFile
import jakarta.inject.Singleton
import org.slf4j.LoggerFactory
import java.time.LocalDate

@Singleton
class ExportService(
    private val pdfExporter: PdfExporter,
    private val excelExporter: ExcelExporter,
    private val offerService: OfferDetailsAssembler
) {

    companion object {
        private val logger = LoggerFactory.getLogger(ExportService::class.java)
    }

    fun createDailyReportPdf(date: LocalDate): SystemFile? {
        return createDailyReport(date, pdfExporter)
    }

    fun createDailyReportExcel(date: LocalDate): SystemFile? {
        return createDailyReport(date, excelExporter)
    }

    private fun createDailyReport(date: LocalDate, exporter: Exporter): SystemFile? {
        val (duration, result) = measureTimeMillisWithReturn {
            val offer = offerService.getByDate(date)
            exporter.export(date, offer) ?: return@measureTimeMillisWithReturn null
        }
        logger.info("Created daily report for $date within $duration ms")
        return result
    }

}
