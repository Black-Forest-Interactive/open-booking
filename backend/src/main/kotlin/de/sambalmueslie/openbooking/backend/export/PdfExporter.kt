package de.sambalmueslie.openbooking.backend.export


import de.sambalmueslie.openbooking.backend.export.tools.LocalDateTimeTool
import de.sambalmueslie.openbooking.backend.offer.api.OfferDetails
import io.micronaut.core.io.scan.ClassPathResourceLoader
import io.micronaut.http.server.types.files.SystemFile
import jakarta.inject.Singleton
import org.apache.fop.apps.FopFactory
import org.apache.fop.apps.MimeConstants
import org.apache.velocity.app.VelocityEngine
import org.apache.velocity.tools.ToolManager
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import java.io.ByteArrayOutputStream
import java.io.File
import java.io.InputStreamReader
import java.io.StringWriter
import java.time.LocalDate
import javax.xml.transform.TransformerFactory
import javax.xml.transform.sax.SAXResult
import javax.xml.transform.stream.StreamSource
import kotlin.jvm.optionals.getOrNull

@Singleton
class PdfExporter(private val loader: ClassPathResourceLoader) : Exporter {

    companion object {
        private val logger: Logger = LoggerFactory.getLogger(PdfExporter::class.java)
    }

    private val fopFactory: FopFactory = FopFactory.newInstance(loader.getResource("classpath:fop/fop.xconf").getOrNull()?.toURI())
    private val ve = VelocityEngine()

    init {
        ve.init()
    }


    override fun export(date: LocalDate, offer: List<OfferDetails>): SystemFile? {
        val properties = mutableMapOf<String, Any>()
        properties["offer"] = offer
        properties["timestamp"] = date.toString()

        val content = export(properties, "dailyReport.vm") ?: return null

        val file = File.createTempFile("DailyReport", ".pdf")
        file.writeBytes(content)
        val filename = "DailyReport${date}.pdf"
        return SystemFile(file).attach(filename)
    }

    private fun export(properties: Map<String, Any>, file: String): ByteArray? {
        val manager = ToolManager()
        val context = manager.createContext()
        context.putVelocityEngine(ve)
        context.putAll(properties)
        context.put("dateTool", LocalDateTimeTool())
        val writer = StringWriter()

        val inputStream = loader.getResourceAsStream("classpath:fop/$file").getOrNull() ?: return null
        ve.evaluate(context, writer, "PDF Export", InputStreamReader(inputStream))

        val out = ByteArrayOutputStream()
        val fop = fopFactory.newFop(MimeConstants.MIME_PDF, out)
        val factory = TransformerFactory.newInstance()
        val transformer = factory.newTransformer()
        val src = StreamSource(writer.toString().byteInputStream())
        val res = SAXResult(fop.defaultHandler)
        transformer.transform(src, res)
        return out.toByteArray()
    }

}
