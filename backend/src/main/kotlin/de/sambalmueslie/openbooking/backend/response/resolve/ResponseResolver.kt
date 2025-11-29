package de.sambalmueslie.openbooking.backend.response.resolve


import de.sambalmueslie.openbooking.backend.export.tools.LocalDateTimeTool
import de.sambalmueslie.openbooking.backend.response.api.ResolvedResponse
import de.sambalmueslie.openbooking.backend.response.api.Response
import jakarta.inject.Singleton
import org.apache.velocity.app.VelocityEngine
import org.apache.velocity.tools.ToolManager
import java.io.StringWriter

@Singleton
class ResponseResolver {

    private val ve = VelocityEngine()

    init {
        ve.init()
    }


    fun resolve(data: Response, properties: Map<String, Any>): ResolvedResponse {
        val title = evaluate(properties, data.title)
        val content = evaluate(properties, data.content)

        return ResolvedResponse(title, content)
    }

    private fun evaluate(properties: Map<String, Any>, raw: String): String {
        val manager = ToolManager()
        val context = manager.createContext()
        context.putVelocityEngine(ve)
        context.putAll(properties)
        context.put("dateTool", LocalDateTimeTool())

        val writer = StringWriter()
        ve.evaluate(context, writer, "Response Resolver", raw)
        return writer.toString()
    }


}
