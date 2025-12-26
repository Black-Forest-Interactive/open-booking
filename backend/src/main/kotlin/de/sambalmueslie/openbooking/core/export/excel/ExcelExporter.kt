package de.sambalmueslie.openbooking.core.export.excel


import de.sambalmueslie.openbooking.core.export.Exporter
import de.sambalmueslie.openbooking.core.offer.api.OfferDetails
import io.micronaut.http.server.types.files.SystemFile
import jakarta.inject.Singleton
import org.apache.poi.xssf.usermodel.XSSFWorkbook
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import java.io.File
import java.time.LocalDate


@Singleton
class ExcelExporter : Exporter {

    companion object {
        private val logger: Logger = LoggerFactory.getLogger(ExcelExporter::class.java)
        private const val HEADER_EXCEL_FILE_SUFIX = ".xlsx"
        private const val HEADER_EXCEL_FILE_PREFIX = "books"
    }

    override fun export(date: LocalDate, offer: List<OfferDetails>): SystemFile? {

        val wb = XSSFWorkbook()
        val builder = ExcelSheetBuilder(wb, date, offer)
        builder.build()


        val file = File.createTempFile(HEADER_EXCEL_FILE_PREFIX, HEADER_EXCEL_FILE_SUFIX)
        wb.write(file.outputStream())
        val filename = "DailyReport${date}.xlsx"
        return SystemFile(file).attach(filename)
    }

}
