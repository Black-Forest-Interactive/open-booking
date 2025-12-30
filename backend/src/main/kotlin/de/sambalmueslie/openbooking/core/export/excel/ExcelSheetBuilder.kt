package de.sambalmueslie.openbooking.core.export.excel


import de.sambalmueslie.openbooking.core.offer.api.OfferDetails
import de.sambalmueslie.openbooking.core.request.api.BookingRequestInfo
import de.sambalmueslie.openbooking.core.request.api.BookingRequestStatus
import org.apache.poi.ss.usermodel.BorderStyle
import org.apache.poi.ss.usermodel.FillPatternType
import org.apache.poi.ss.usermodel.HorizontalAlignment
import org.apache.poi.ss.usermodel.VerticalAlignment
import org.apache.poi.ss.util.CellRangeAddress
import org.apache.poi.ss.util.CellUtil
import org.apache.poi.ss.util.RegionUtil
import org.apache.poi.xssf.usermodel.IndexedColorMap
import org.apache.poi.xssf.usermodel.XSSFCellStyle
import org.apache.poi.xssf.usermodel.XSSFColor
import org.apache.poi.xssf.usermodel.XSSFWorkbook
import java.awt.Color
import java.time.LocalDate
import java.time.format.DateTimeFormatter


class ExcelSheetBuilder(
    private val wb: XSSFWorkbook,
    private val date: LocalDate,
    private val offer: List<OfferDetails>
) {

    companion object {
        private val formatter = DateTimeFormatter.ofPattern("HH:mm")

        // Donnerstag, 16. März 2023
        private val headlineFormatter = DateTimeFormatter.ofPattern("EEEE ,dd. LLLL yyyy")
    }

    private val sheet = wb.createSheet(date.toString())
    private var rowIndex = 3
    private val styleOfferHeaderBold = wb.createCellStyle()
    private val styleOfferHeaderBoldCombined = wb.createCellStyle()
    private val styleOfferHeaderText = wb.createCellStyle()
    private val styleBooking = wb.createCellStyle()
    private val styleBookingCombined = wb.createCellStyle()

    private val boldFont = wb.createFont()
    private val boldFontInverted = wb.createFont()
    private val normalFont = wb.createFont()

    private val colorMap: IndexedColorMap = wb.stylesSource.indexedColors
    private val colors = listOf(
        Pair(XSSFColor(Color(0, 112, 192), colorMap), boldFontInverted), // dark blue
        Pair(XSSFColor(Color(166, 166, 166), colorMap), boldFont), // gray
        Pair(XSSFColor(Color(191, 143, 0), colorMap), boldFont), // gold
        Pair(XSSFColor(Color(180, 198, 231), colorMap), boldFont), // light blue
        Pair(XSSFColor(Color(0, 0, 0), colorMap), boldFontInverted), // black
        Pair(XSSFColor(Color(0, 176, 80), colorMap), boldFont), // green
        Pair(XSSFColor(Color(255, 255, 255), colorMap), boldFont), // white
        Pair(XSSFColor(Color(255, 0, 0), colorMap), boldFont), // red
        Pair(XSSFColor(Color(255, 153, 255), colorMap), boldFont), //pink
        Pair(XSSFColor(Color(255, 153, 0), colorMap), boldFont), // orange
        Pair(XSSFColor(Color(112, 48, 160), colorMap), boldFontInverted), // purple
        Pair(XSSFColor(Color(255, 255, 0), colorMap), boldFont),// yellow
    )

    private val colorHeaders = mutableListOf<XSSFCellStyle>()

    fun build() {
        setupStyles()
        setupSheet()
        setupHeadline()
        offer.filter { it.offer.active }.forEachIndexed { index, offer -> setupOffer(index, offer) }
    }

    private fun setupStyles() {

        boldFont.bold = true
        boldFont.fontHeightInPoints = 12

        boldFontInverted.bold = true
        boldFontInverted.fontHeightInPoints = 12
        boldFontInverted.setColor(XSSFColor(Color(255, 255, 255), colorMap))

        normalFont.fontHeightInPoints = 12

        styleOfferHeaderBold.setFillForegroundColor(XSSFColor(Color(217, 217, 217), colorMap))
        styleOfferHeaderBold.fillPattern = FillPatternType.SOLID_FOREGROUND
        styleOfferHeaderBold.setFont(boldFont)
        styleOfferHeaderBold.borderBottom = BorderStyle.THIN
        styleOfferHeaderBold.alignment = HorizontalAlignment.CENTER

        colors.forEach { (color, font) ->
            val header = wb.createCellStyle()
            header.setFillForegroundColor(color)
            header.fillPattern = FillPatternType.SOLID_FOREGROUND
            header.setFont(font)
            header.borderBottom = BorderStyle.THIN
            header.alignment = HorizontalAlignment.CENTER

            colorHeaders.add(header)
        }

        styleOfferHeaderBoldCombined.setFillForegroundColor(XSSFColor(Color(217, 217, 217), colorMap))
        styleOfferHeaderBoldCombined.fillPattern = FillPatternType.SOLID_FOREGROUND
        styleOfferHeaderBoldCombined.setFont(boldFont)
        styleOfferHeaderBoldCombined.borderBottom = BorderStyle.THIN
        styleOfferHeaderBoldCombined.wrapText = true
        styleOfferHeaderBoldCombined.verticalAlignment = VerticalAlignment.CENTER
        styleOfferHeaderBoldCombined.alignment = HorizontalAlignment.CENTER

        styleOfferHeaderText.setFillForegroundColor(XSSFColor(Color(217, 217, 217), colorMap))
        styleOfferHeaderText.fillPattern = FillPatternType.SOLID_FOREGROUND
        styleOfferHeaderText.alignment = HorizontalAlignment.RIGHT
        styleOfferHeaderText.borderBottom = BorderStyle.THIN
        styleOfferHeaderText.setFont(normalFont)

        styleBooking.fillPattern = FillPatternType.NO_FILL
        styleBooking.borderBottom = BorderStyle.THIN
        styleBooking.verticalAlignment = VerticalAlignment.CENTER
        styleBooking.alignment = HorizontalAlignment.CENTER
        styleBooking.setFont(normalFont)

        styleBookingCombined.fillPattern = FillPatternType.NO_FILL
        styleBookingCombined.borderBottom = BorderStyle.THIN
        styleBookingCombined.wrapText = true
        styleBookingCombined.verticalAlignment = VerticalAlignment.CENTER
        styleBookingCombined.alignment = HorizontalAlignment.CENTER
        styleBookingCombined.setFont(normalFont)

    }


    private fun setupHeadline() {
        val row = sheet.createRow(1)
        val cell = row.createCell(1)
        cell.setCellValue(date.format(headlineFormatter))
        val font = wb.createFont()
        font.fontHeightInPoints = 14
        font.bold = true

        val borderStyle = wb.createCellStyle()
        borderStyle.borderBottom = BorderStyle.THIN
        borderStyle.setFont(font)
        cell.cellStyle = borderStyle

        (2..9).forEach { row.createCell(it).cellStyle = borderStyle }
        sheet.addMergedRegion(CellRangeAddress(row.rowNum, row.rowNum, 1, 9))
    }

    private fun setupSheet() {
        sheet.setColumnWidth(0, 5 * 256)
        sheet.setColumnWidth(1, 9 * 256)
        sheet.setColumnWidth(2, 9 * 256)
        sheet.setColumnWidth(3, 14 * 256)
        sheet.setColumnWidth(4, 12 * 256)
        sheet.setColumnWidth(5, 9 * 256)
        sheet.setColumnWidth(6, 5 * 256)
        sheet.setColumnWidth(7, 9 * 256)
        sheet.setColumnWidth(8, 9 * 256)
        sheet.setColumnWidth(9, 22 * 256)
    }

    private fun setupOffer(index: Int, details: OfferDetails) {
        val colorHeader = colorHeaders[index % colorHeaders.size]
        createOfferHeaderLine1(colorHeader, details)
        createOfferHeaderLine2(colorHeader, details)

        val bookings = details.bookings.filter { it.status != BookingRequestStatus.DENIED }
        bookings.forEachIndexed { index, info -> setupBooking(index, info) }

        if (bookings.isEmpty()) setupEmptyBooking()

        val firstRow = if (bookings.isEmpty()) rowIndex - 3 else rowIndex - bookings.size - 2
        val region = CellRangeAddress(firstRow, rowIndex - 1, 1, 9)
        RegionUtil.setBorderLeft(BorderStyle.MEDIUM, region, sheet)
        RegionUtil.setBorderRight(BorderStyle.MEDIUM, region, sheet)
        RegionUtil.setBorderBottom(BorderStyle.MEDIUM, region, sheet)
        RegionUtil.setBorderTop(BorderStyle.MEDIUM, region, sheet)

        sheet.createRow(rowIndex++)
    }


    private fun createOfferHeaderLine1(colorHeader: XSSFCellStyle, details: OfferDetails) {
        val row = sheet.createRow(rowIndex++)

        val timeCell = row.createCell(1)
        timeCell.setCellValue(details.offer.start.format(formatter))
        timeCell.cellStyle = colorHeader
        row.createCell(2).cellStyle = styleOfferHeaderBold

        val spaceConfirmed = details.bookings.filter { it.status == BookingRequestStatus.CONFIRMED }.sumOf { it.visitor.size }
        val spaceAvailable = Math.max(details.offer.maxPersons - spaceConfirmed, 0)

        val usedTextCell = row.createCell(3)
        usedTextCell.setCellValue("Belegt:")
        usedTextCell.cellStyle = styleOfferHeaderText
        val usedValueCell = row.createCell(4)
        usedValueCell.setCellValue(spaceConfirmed.toDouble())
        usedValueCell.cellStyle = styleOfferHeaderBold
        CellUtil.setAlignment(usedValueCell, HorizontalAlignment.LEFT)

        val availableTextCell = row.createCell(5)
        availableTextCell.setCellValue("frei:")
        availableTextCell.cellStyle = styleOfferHeaderText
        val availableValueCell = row.createCell(6)
        availableValueCell.setCellValue(spaceAvailable.toDouble())
        availableValueCell.cellStyle = styleOfferHeaderBold
        CellUtil.setAlignment(availableValueCell, HorizontalAlignment.LEFT)

        row.createCell(7).cellStyle = styleOfferHeaderBold
        row.createCell(8).cellStyle = styleOfferHeaderBold
        row.createCell(9).cellStyle = styleOfferHeaderBold
    }


    private fun createOfferHeaderLine2(colorHeader: XSSFCellStyle, details: OfferDetails) {
        val row = sheet.createRow(rowIndex++)

        val indexCell = row.createCell(1)
        indexCell.setCellValue("Nr")
        indexCell.cellStyle = colorHeader

        val groupCell = row.createCell(2)
        groupCell.setCellValue("Gruppe")
        groupCell.cellStyle = styleOfferHeaderBoldCombined
        row.createCell(3).cellStyle = styleOfferHeaderBold
        sheet.addMergedRegion(CellRangeAddress(row.rowNum, row.rowNum, 2, 3))

        val contactCell = row.createCell(4)
        contactCell.setCellValue("Kontakt")
        contactCell.cellStyle = styleOfferHeaderBoldCombined
        row.createCell(5).cellStyle = styleOfferHeaderBold
        sheet.addMergedRegion(CellRangeAddress(row.rowNum, row.rowNum, 4, 5))

        val sizeCell = row.createCell(6)
        sizeCell.setCellValue("Pers")
        sizeCell.cellStyle = styleOfferHeaderBold

        val noteCell = row.createCell(7)
        noteCell.setCellValue("Anmerkungen")
        noteCell.cellStyle = styleOfferHeaderBoldCombined
        CellUtil.setCellStyleProperty(noteCell, CellUtil.BORDER_LEFT, BorderStyle.THIN)

        row.createCell(8).cellStyle = styleOfferHeaderBold
        row.createCell(9).cellStyle = styleOfferHeaderBold
        sheet.addMergedRegion(CellRangeAddress(row.rowNum, row.rowNum, 7, 9))
    }

    private fun setupBooking(index: Int, info: BookingRequestInfo) {
        val row = sheet.createRow(rowIndex++)

        val indexCell = row.createCell(1)
        indexCell.setCellValue(index.toDouble())
        indexCell.cellStyle = styleBooking

        val groupCell = row.createCell(2)
        groupCell.setCellValue(info.visitor.title)
        groupCell.cellStyle = styleBookingCombined

        row.createCell(3).cellStyle = styleBooking
        sheet.addMergedRegion(CellRangeAddress(row.rowNum, row.rowNum, 2, 3))

        val contactCell = row.createCell(4)
        contactCell.setCellValue(info.visitor.contact)
        contactCell.cellStyle = styleBookingCombined
        row.createCell(5).cellStyle = styleBooking
        sheet.addMergedRegion(CellRangeAddress(row.rowNum, row.rowNum, 4, 5))

        val sizeCell = row.createCell(6)
        sizeCell.setCellValue(info.visitor.size.toDouble())
        sizeCell.cellStyle = styleBooking

        val noteCell = row.createCell(7)
        noteCell.setCellValue(info.comment)
        noteCell.cellStyle = styleBookingCombined
        CellUtil.setCellStyleProperty(noteCell, CellUtil.BORDER_LEFT, BorderStyle.THIN)

        row.createCell(8).cellStyle = styleBooking
        row.createCell(9).cellStyle = styleBooking

        sheet.addMergedRegion(CellRangeAddress(row.rowNum, row.rowNum, 7, 9))
        row.height = -1
    }


    private fun setupEmptyBooking() {
        val row = sheet.createRow(rowIndex++)

        val indexCell = row.createCell(1)
        indexCell.setCellValue(1.0)
        indexCell.cellStyle = styleBooking
        CellUtil.setAlignment(indexCell, HorizontalAlignment.CENTER)

        val groupCell = row.createCell(2)
        groupCell.cellStyle = styleBookingCombined
        row.createCell(3).cellStyle = styleBooking
        sheet.addMergedRegion(CellRangeAddress(row.rowNum, row.rowNum, 2, 3))

        val contactCell = row.createCell(4)
        contactCell.cellStyle = styleBookingCombined
        row.createCell(5).cellStyle = styleBooking
        sheet.addMergedRegion(CellRangeAddress(row.rowNum, row.rowNum, 4, 5))

        val sizeCell = row.createCell(6)
        sizeCell.cellStyle = styleBooking
        CellUtil.setAlignment(sizeCell, HorizontalAlignment.CENTER)

        val noteCell = row.createCell(7)
        noteCell.cellStyle = styleBookingCombined
        CellUtil.setCellStyleProperty(noteCell, CellUtil.BORDER_LEFT, BorderStyle.THIN)

        row.createCell(8).cellStyle = styleBooking
        row.createCell(9).cellStyle = styleBooking
        sheet.addMergedRegion(CellRangeAddress(row.rowNum, row.rowNum, 7, 9))
    }
}
