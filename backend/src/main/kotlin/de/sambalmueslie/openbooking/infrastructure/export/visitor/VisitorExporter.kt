package de.sambalmueslie.openbooking.infrastructure.export.visitor

import de.sambalmueslie.openbooking.common.PageableSequence
import de.sambalmueslie.openbooking.common.TimeProvider
import de.sambalmueslie.openbooking.core.booking.api.BookingDetails
import de.sambalmueslie.openbooking.core.search.booking.BookingSearchOperator
import de.sambalmueslie.openbooking.core.search.booking.api.BookingSearchRequest
import io.micronaut.http.server.types.files.SystemFile
import jakarta.inject.Singleton
import org.apache.poi.xssf.usermodel.XSSFSheet
import org.apache.poi.xssf.usermodel.XSSFWorkbook
import org.slf4j.LoggerFactory
import java.io.File
import java.time.format.DateTimeFormatter

@Singleton
class VisitorExporter(
    private val searchOperator: BookingSearchOperator,
    private val timeProvider: TimeProvider
) {
    companion object {
        private val logger = LoggerFactory.getLogger(VisitorExporter::class.java)
        private const val HEADER_EXCEL_FILE_SUFIX = ".xlsx"
        private const val HEADER_EXCEL_FILE_PREFIX = "visitor"

        private val formatter = DateTimeFormatter.ofPattern("HH:mm")

        // Donnerstag, 16. März 2023
        private val headlineFormatter = DateTimeFormatter.ofPattern("EEEE ,dd. LLLL yyyy")

        private const val COL_OFFER_INDEX = 0
        private const val COL_VISITOR_NAME_INDEX = 1
        private const val COL_VISITOR_TITLE_INDEX = 2
        private const val COL_VISITOR_EMAIL_INDEX = 3
        private const val COL_VISITOR_TYPE_INDEX = 4
        private const val COL_VISITOR_SIZE_INDEX = 5
        private const val COL_BOOKING_COMMENT_INDEX = 6
        private const val COL_BOOKING_STATUS_INDEX = 7
        private const val COL_VERIFICATION_STATUS_INDEX = 8
    }


    fun export(request: BookingSearchRequest): SystemFile? {
        val wb = XSSFWorkbook()

        val sheet = wb.createSheet("visitor")
        setupSheet(sheet)
        addHeader(sheet)

        val sequence = PageableSequence() { searchOperator.search(request, it).result }
        sequence.forEachIndexed { index, details -> addRow(wb, sheet, index + 2, details) }

        val file = File.createTempFile(HEADER_EXCEL_FILE_PREFIX, HEADER_EXCEL_FILE_SUFIX)
        wb.write(file.outputStream())
        val filename = "visitor-export-${timeProvider.now().format(DateTimeFormatter.BASIC_ISO_DATE)}.xlsx"
        return SystemFile(file).attach(filename)
    }

    private fun setupSheet(sheet: XSSFSheet) {
        sheet.setColumnWidth(COL_OFFER_INDEX, 18 * 256)
        sheet.setColumnWidth(COL_VISITOR_NAME_INDEX, 18 * 256)
        sheet.setColumnWidth(COL_VISITOR_TITLE_INDEX, 20 * 256)
        sheet.setColumnWidth(COL_VISITOR_EMAIL_INDEX, 15 * 256)
        sheet.setColumnWidth(COL_VISITOR_TYPE_INDEX, 10 * 256)
        sheet.setColumnWidth(COL_VISITOR_SIZE_INDEX, 13 * 256)
        sheet.setColumnWidth(COL_BOOKING_COMMENT_INDEX, 20 * 256)
        sheet.setColumnWidth(COL_BOOKING_STATUS_INDEX, 12 * 256)
        sheet.setColumnWidth(COL_VERIFICATION_STATUS_INDEX, 12 * 256)
    }

    private fun addHeader(sheet: XSSFSheet) {
        val row = sheet.createRow(1)

        val offerCell = row.createCell(COL_OFFER_INDEX)
        offerCell.setCellValue("Angebot")

        val visitorNameCell = row.createCell(COL_VISITOR_NAME_INDEX)
        visitorNameCell.setCellValue("Name")

        val visitorTitleCell = row.createCell(COL_VISITOR_TITLE_INDEX)
        visitorTitleCell.setCellValue("Title")

        val visitorEmailCell = row.createCell(COL_VISITOR_EMAIL_INDEX)
        visitorEmailCell.setCellValue("EMail")

        val visitorTypeCell = row.createCell(COL_VISITOR_TYPE_INDEX)
        visitorTypeCell.setCellValue("Besucherart")

        val visitorSizeCell = row.createCell(COL_VISITOR_SIZE_INDEX)
        visitorSizeCell.setCellValue("Anzahl Personen")

        val bookingCommentCell = row.createCell(COL_BOOKING_COMMENT_INDEX)
        bookingCommentCell.setCellValue("Comment")

        val bookingStatusCell = row.createCell(COL_BOOKING_STATUS_INDEX)
        bookingStatusCell.setCellValue("Buchungsstatus")

        val verificationStatusCell = row.createCell(COL_VERIFICATION_STATUS_INDEX)
        verificationStatusCell.setCellValue("Verifizierung")

    }

    private fun addRow(wb: XSSFWorkbook, sheet: XSSFSheet, rowIndex: Int, details: BookingDetails) {
        val row = sheet.createRow(rowIndex)

        val offerCell = row.createCell(COL_OFFER_INDEX)
        offerCell.setCellValue(headlineFormatter.format(details.offer.offer.start))

        val visitorNameCell = row.createCell(COL_VISITOR_NAME_INDEX)
        visitorNameCell.setCellValue(details.visitor.name)

        val visitorTitleCell = row.createCell(COL_VISITOR_TITLE_INDEX)
        visitorTitleCell.setCellValue(details.visitor.title)

        val visitorEmailCell = row.createCell(COL_VISITOR_EMAIL_INDEX)
        visitorEmailCell.setCellValue(details.visitor.email)

        val visitorTypeCell = row.createCell(COL_VISITOR_TYPE_INDEX)
        visitorTypeCell.setCellValue(details.visitor.type.name)

        val visitorSizeCell = row.createCell(COL_VISITOR_SIZE_INDEX)
        visitorSizeCell.setCellValue(details.visitor.size.toString())

        val bookingCommentCell = row.createCell(COL_BOOKING_COMMENT_INDEX)
        bookingCommentCell.setCellValue(details.booking.comment)

        val bookingStatusCell = row.createCell(COL_BOOKING_STATUS_INDEX)
        bookingStatusCell.setCellValue(details.booking.status.name)

        val verificationStatusCell = row.createCell(COL_VERIFICATION_STATUS_INDEX)
        verificationStatusCell.setCellValue(details.visitor.verification.status.name)
    }
}